import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export function extractThumbnail(inputPath: string, videoId: string): Promise<string> {
  const outputPath = `/tmp/thumb-${videoId}.jpg`;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .screenshots({
        count: 1,
        folder: '/tmp',
        filename: `thumb-${videoId}.jpg`,
        size: '320x240'
      });
  });
}
