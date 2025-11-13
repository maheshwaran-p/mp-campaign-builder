import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatServiceOrig } from './chat-orig.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import { CreativeService } from 'src/creative/creative.service';
import { UtilsService } from 'src/utils/utils.service';
import { ChatService } from './chat.service';
import { PromptsService } from 'src/prompts/prompts.service';
import { GeminiService } from 'src/llm/gemini.service';
import { DemographicsTool, DemographicsToolService, AudienceTool, AudienceToolService, GeographyTool, GeographyToolService} from 'src/tools';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    ChatServiceOrig, 
    CreativeService, 
    UtilsService, 
    ChatService, 
    PromptsService, 
    GeminiService,
    DemographicsTool,
    DemographicsToolService,
    AudienceTool,
    AudienceToolService,
    GeographyTool,
    GeographyToolService
  ],
  controllers: [ChatController],
})
export class ChatModule {}
