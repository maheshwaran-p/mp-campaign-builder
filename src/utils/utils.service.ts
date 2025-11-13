import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'fs/promises';
import { v4 as uuid } from 'uuid';
import { UploadVideoCreativeDTO } from './dto/upload-video-creative.dto';
import { extractThumbnail } from './extrract-thumbnail';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
@Injectable()
export class UtilsService {
  private readonly s3: S3Client;
  private readonly logger = new Logger(UtilsService.name);
  private readonly bucketName: string;
  constructor(private readonly configService: ConfigService) {
    // this.s3 = new S3Client({ region: 'ap-south-1' });
    // this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME')!;
     this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME')!;
    this.s3 = new S3Client({
      region: 'us-west-2',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }
  async saveUploadedFile(file: Express.Multer.File, videoId: string): Promise<string> {
    const filePath = `/tmp/${videoId}-${file.originalname}`;
    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }
  async processVideo(videoId:string,filePath:string) {
    try {
      // const { videoId, filePath } = dto;
      // Upload original video
      const videoKey = `creatives/${videoId}/${uuid()}.mp4`;
      const videoUrl = await this.uploadToS3(filePath, videoKey);
      // Extract and upload thumbnail
      const thumbnailPath = await extractThumbnail(filePath, videoId);
      const thumbnailKey = `creatives/${videoId}/thumb-${uuid()}.jpg`;
      const thumbnailUrl = await this.uploadToS3(thumbnailPath, thumbnailKey);
      return {
        videoUrl,
        thumbnailUrl,
        status: 'uploaded',
      };
    } catch (err) {
      this.logger.error('Error processing video', err);
      
      throw new InternalServerErrorException('Failed to upload video.');
    }
  }
  async uploadToS3(filePath: string, key: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: key.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
        ACL: 'public-read',
      }),
    );
    return `https://${this.bucketName}.s3.us-west-2.amazonaws.com/${key}`;
  }
}









