import { Options as MulterOptions } from 'multer';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export const uploadMulterConfig: MulterOptions = {
  limits: { fileSize: 100 * 1024 * 1024 },

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed') as any, false);
    }
    cb(null, true);
  },
};
