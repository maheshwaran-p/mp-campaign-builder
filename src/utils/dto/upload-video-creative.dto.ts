import { ApiProperty } from '@nestjs/swagger';

export class UploadVideoCreativeDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty()
  videoId: string;

  @ApiProperty()
  campaignId: string;

  @ApiProperty()
  partnerId: string;
}
