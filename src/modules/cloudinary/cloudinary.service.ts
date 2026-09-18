import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwxxjidhk',
      api_key: process.env.CLOUDINARY_API_KEY || '129941424473655',
      api_secret: process.env.CLOUDINARY_API_SECRET || '0_CRp8QvcY4FzC8cHpL7Igslg1w',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'tb_compliance_evidence',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error)
              return reject(new Error(error.message || 'Upload failed'));
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
