import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

@Injectable()
export class DocsService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
  });

  async upload(fileName: string, file: Buffer) {
    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file,
      }),
    );
  }

  async listarArchivos() {
    const response = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
      }),
    );

    return (response.Contents ?? []).map((objeto) => ({
      key: objeto.Key,
      size: objeto.Size,
      lastModified: objeto.LastModified,
    }));
  }

  async uploadMasivo(files: Express.Multer.File[]) {
    const resultados = await Promise.all(
      files.map((file) => this.upload(file.originalname, file.buffer)),
    );
    return {
      archivosSubidos: files.length,
      resultados,
    };
  }
}
