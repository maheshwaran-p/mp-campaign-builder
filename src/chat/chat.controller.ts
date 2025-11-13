import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Sse,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ChatServiceOrig } from './chat-orig.service';
import { ChatRequestDtoOrig } from './dto/chat-request-orig.dto';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatServiceOrig, private readonly chatService1: ChatService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async handleChat(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: ChatRequestDtoOrig,
  ) {
     return await this.chatService.processChat(body, files);

  }

  @Post('message')
  async handleMessage(@Body() body: ChatRequestDto) {
    return await this.chatService1.processMessage(body);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async handleUpload(@Body() body: ChatRequestDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.chatService1.processUpload(body, files);
  }

  /**
   * SSE endpoint: only accepts sessionId and message
   */
  @Sse('stream')
  streamMessage(@Query('sessionId') sessionId: string, @Query('message') message: string): Observable<any> {
    return this.chatService1.streamMessage({ sessionId, message });
  }

}