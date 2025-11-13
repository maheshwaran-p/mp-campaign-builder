import { IsOptional, IsString, IsObject } from 'class-validator';

export class ChatRequestDtoOrig {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsObject()
  fields?: Record<string, string>;
}
