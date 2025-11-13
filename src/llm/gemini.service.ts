import { Injectable } from "@nestjs/common";
import { GoogleGenAI, Content, Type } from '@google/genai';
import { ConfigService } from "@nestjs/config";
const MODEL = 'gemini-2.5-flash';

export interface GeminiResponse {
  message: string;
  state?: Record<string, any>;
  action?: {
    type: string;
    tool_call?: {
      tool: string;
      parameters?: Record<string, any>;
    };
  };
}

@Injectable()
export class GeminiService {
  private geminiClient: GoogleGenAI;
  constructor(private configService: ConfigService) {
    this.geminiClient = new GoogleGenAI({
      apiKey: this.configService.get('GEMINI_API_KEY'),
    });
  }

  async generateResponse(prompt: string): Promise<GeminiResponse> {
    try {
      const response = await this.geminiClient.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              state: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                  name: { type: Type.STRING, nullable: true },
                  budget: { type: Type.NUMBER, nullable: true },
                  advertiserCategory: { type: Type.STRING, nullable: true },
                  objective: { type: Type.STRING, nullable: true },
                  priority: { type: Type.STRING, nullable: true },
                  startDate: { type: Type.STRING, nullable: true },
                  endDate: { type: Type.STRING, nullable: true },
                  advertiser: { type: Type.STRING, nullable: true },
                  creatives: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                  products: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                  demography: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                  audience: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                  geo: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                  dayParting: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                }
              },
              action: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                  type: { type: Type.STRING },
                  tool_call: {
                    type: Type.OBJECT,
                    nullable: true,
                    properties: {
                      tool: { type: Type.STRING },
                      parameters: {
                        type: Type.OBJECT,
                        nullable: true,
                        properties: {
                          action: { 
                            type: Type.STRING,
                          },
                          location: { type: Type.STRING, nullable: true },
                          radiusMiles: { type: Type.NUMBER, nullable: true }
                        }
                      }
                    }
                  }
                }
              }
            },
            required: ["action", "message", "state"],
          },
        },
      });
      if (!response.text) throw new Error('No response text from Gemini');
      
      let cleanedText = response.text;
      cleanedText = cleanedText.replace(
        /(\d{4}-\d{2}-\d{2})T[\d:.]+Z?\[?[^\]"]*\]?[^"]*(?=")/g,
        '$1'
      );
      
      
      const parsed: GeminiResponse = JSON.parse(cleanedText);
      console.log('[GeminiService] Structured Gemini output:', parsed);
      return parsed;
    } catch (error) {
      console.error('[GeminiService] Error parsing structured output.', error);
      console.error('[GeminiService] Raw response text:', error.message);
      return {
        message: 'Sorry, there was an error generating a structured response.',
        state: {},
      };
    }
  }
}