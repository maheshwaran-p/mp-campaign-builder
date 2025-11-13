/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, BadRequestException, UploadedFile } from '@nestjs/common';
import { GoogleGenAI, Content } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CreativeService, SupportedVideoExtensions, VideoMetadata } from 'src/creative/creative.service';
import * as crypto from 'crypto';
import { UtilsService } from 'src/utils/utils.service';
const REQUIRED_FIELDS = [
  'Campaign Name',
  'Priority',
  'Start Date',
  'End Date',
  'Total Retail Budget',
  'Campaign Objective',
] as const;
type RequiredFieldKeys = (typeof REQUIRED_FIELDS)[number];
export interface CampaignFields {
  'Campaign Name': string;
  Priority: string;
  'Start Date': string;
  'End Date': string;
  'Total Retail Budget': string;
  'Campaign Objective': string;
}
interface SessionState {
  fields: Partial<CampaignFields>;
  history: Content[];
}
@Injectable()
export class ChatServiceOrig {
  private memoryStore = new Map<string, SessionState>();
  private genAI: GoogleGenAI;
  private readonly systemInstructions: Content;
  private readonly initialPrompt: Content;
  constructor(
    configService: ConfigService,
    private readonly creativeService:CreativeService,
  private readonly utilsService:UtilsService) {
    const GEMINI_API_KEY = configService.get<string>('GEMINI_API_KEY')!;
    this.genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    this.systemInstructions = {
      role: 'system',
      parts: [
        {
          text: `You are a friendly, helpful AdTech campaign assistant.
Always return a single valid JSON object only.
All your output — including any explanation or user instructions — must be inside the "message" field of the JSON.
Never include text outside the JSON.
Never use markdown formatting.
Never repeat yourself.
Never invent values if unclear.
If unsure of any field, set it to null.`,
        },
      ],
    };
    this.initialPrompt = {
      role: 'user',
      parts: [
        {
          text: `Your job is to extract campaign fields from the user's message or link. These fields are:
- Campaign Name
- Priority (Low, Medium, High)
- Start Date
- End Date
- Total Retail Budget
- Campaign Objective
  RULES:
- If a product link is present, use Google Search to understand the product and purpose of the campaign.
  Example: "Promote this product https://ecoflowindia.com during hurricane" → Campaign Name: EcoFlow Hurricane Promo, etc.
- If the message mentions festivals or events like "Diwali", "launch event", or "Black Friday", use Google Search to determine the correct start and end dates.
- Do not invent values. Only fill a field if you're confident. Otherwise, set it to null.
- Output must only be one valid JSON object. Never include anything outside the JSON.
- All human-facing output must go in the "message" field.
- If you were to update the json then keep track of previous context history json
- The "message" field should:
  - Be short, friendly, and helpful
  - Politely ask the user to provide any missing fields
  - Use casual, natural tone with emojis or variety
FORMAT:
{
  "Campaign Name": string | null,
  "Priority": string | null,
  "Start Date": string | null,
  "End Date": string | null,
  "Total Retail Budget": string | null,
  "Campaign Objective": string | null,
  "message": "friendly short response that asks user to provide missing fields"
}`,
        },
      ],
    };
  }
async processChat(
  body: {
    text?: string;
    sessionId?: string;
    fields?: Partial<CampaignFields>;
  },
  files?: Array<Express.Multer.File>,
) {
    const sessionId = body.sessionId || uuidv4();
  const session: SessionState = this.memoryStore.get(sessionId) || {
    fields: body.fields || {},
    history: [this.initialPrompt],
  };
let videoMetadata:VideoMetadata| undefined;
let isValidVideo ;
let text;
let uploadedVideoResponse;
if (files?.length) {
  for (const file of files) {
    const mime = file.mimetype;
    if (mime.startsWith('video/')) {
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';
    const isSupported = SupportedVideoExtensions.includes(fileExtension);
      if (!isSupported) {
        isValidVideo = false;
        throw new BadRequestException(`Unsupported video format: .${fileExtension}`);
      }
      try {
        videoMetadata = await this.creativeService.extractVideoMetadata(file.buffer,fileExtension);
        const videoId = crypto.randomBytes(16).toString('hex');
        const filePath=await this.utilsService.saveUploadedFile(file, videoId)
         uploadedVideoResponse=await this.utilsService.processVideo(videoId,filePath);
        isValidVideo = true;
      } catch (err) {
        console.error('Video metadata extraction failed:', err);
        throw new BadRequestException('Failed to extract video metadata.');
      }
    }
    else {
         try {
           const { getTextExtractor } = await import('office-text-extractor');
    const extractor = getTextExtractor();
     text = await extractor.extractText({input:file.buffer,type:'buffer'});
  } catch (error) {
    console.error('Extraction failed:', error);
    text=error.message;
  }
      }
  }
}
// const inputText = body.text ||  (files && files.map((file) => file.buffer.toString('utf-8')).join('\n'));
const inputText =
  body.text ||
  files
    ?.filter((file) => file.mimetype.startsWith('text/'))
    .map((file) => file.buffer.toString('utf-8'))
    .join('\n') ||
  (videoMetadata ? 'A video file was uploaded. Please extract campaign details based on the media content.' : '')||text;
  if (!files?.length && !inputText) {
  throw new BadRequestException('No valid input text or supported file provided.');
}
session.history.push({ role: 'user', parts: [{ text: inputText }] });
   const result = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: this.systemInstructions,
        tools: [{ googleSearch: {} }],
      },
      contents: session.history,
    });
  const rawText = result.text?.trim() ?? 'No response from gemini';
  session.history.push({ role: 'model', parts: [{ text: rawText }] });
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    this.memoryStore.set(sessionId, session);
    return { sessionId, message: rawText };
  }
  let parsed: Partial<CampaignFields> & { message?: string } = {};
  try {
    parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
    this.memoryStore.set(sessionId, session);
    return { sessionId, message: rawText };
  }
  for (const key of REQUIRED_FIELDS) {
    if (parsed[key]) {
      session.fields[key] = parsed[key];
    }
  }
  const missing = this.getMissingFields(session.fields);
  this.memoryStore.set(sessionId, session);
  return missing.length
  ? {
      sessionId,
      extracted: session.fields,
      missing,
      isValidVideo,
      uploadedVideoResponse,
      message: videoMetadata
        ? `Video metadata processed successfully.${JSON.stringify(videoMetadata)}`
        : (parsed.message ||
            `You're almost done. Please share missing fields: ${missing.join(', ')}`),
    }
  : {
      sessionId,
      campaign: session.fields,
      isValidVideo,
      uploadedVideoResponse,
      message: videoMetadata
        ? `Video metadata processed successfully.${JSON.stringify(videoMetadata)}`
        : (parsed.message || `All campaign details are complete.`),
    };
}
  private getMissingFields(data: Partial<CampaignFields>): RequiredFieldKeys[] {
    return REQUIRED_FIELDS.filter((key) => !data[key]);
  }
}