import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffprobeStatic from 'ffprobe-static';
import { ConfigService } from '@nestjs/config';
ffmpeg.setFfprobePath(ffprobeStatic.path);

export const SupportedVideoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'];

export type VideoMetadata = {
  fileName?: string;
  fileType: string;
  duration: number;
  codec: string;
  videoBitrate: string | null;
  audioBitrate: string | null;
  dimensions: { width: number; height: number } | null;
  aspectRatio: string | null;
  fps: number | null;
  fileSize?: number;
};

@Injectable()
export class CreativeService {
constructor(private readonly configService:ConfigService){ }
    async extractVideoMetadata(buffer: Buffer, fileExtension: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      ffmpeg(stream).ffprobe((err, data) => {
        if (err) {
          console.error('Error extracting video metadata:', err);
          reject(new Error('Failed to extract video metadata'));
          return;
        }

        const videoStream = data.streams.find((s) => s.codec_type === 'video');
        const audioStream = data.streams.find((s) => s.codec_type === 'audio');

        const fps = videoStream?.avg_frame_rate;
        const fpsValue = fps ? this.calculateFPS(fps) : null;

        let aspectRatio = videoStream?.display_aspect_ratio || null;
        if ((!aspectRatio || aspectRatio === 'N/A') && videoStream?.width && videoStream?.height) {
          const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
          const divisor = gcd(videoStream.width, videoStream.height);
          const widthRatio = videoStream.width / divisor;
          const heightRatio = videoStream.height / divisor;
          aspectRatio = `${widthRatio}:${heightRatio}`;
        }

        const metadata = {
          fileType: this.determineFileType(data.format.format_name, fileExtension),
          duration: data.format.duration,
          codec: videoStream?.codec_name || 'Unknown',
          videoBitrate: videoStream?.bit_rate || null,
          audioBitrate: audioStream?.bit_rate || null,
          dimensions: videoStream ? { width: videoStream.width, height: videoStream.height } : null,
          aspectRatio: aspectRatio,
          fps: fpsValue,
          fileSize: buffer.length, 
        };

        resolve(metadata);
      });
    });
  }
private calculateFPS(fpsString: string): number | null {
    const [numerator, denominator] = fpsString.split('/').map(Number);
    return denominator ? Math.ceil(numerator / denominator) : null;
  }

  private determineFileType(formatName: string, fileExtension: string): string {
    const formats = formatName.split(',');
    return formats.includes(fileExtension)
      ? fileExtension
      : formats.find((format) => SupportedVideoExtensions.some((ext) => format.includes(ext))) || formats[0];
  }

}
