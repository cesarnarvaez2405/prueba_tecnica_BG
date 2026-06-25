import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { ResultsService } from '../results/results.service';

@Injectable()
export class DocsService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
  });

  constructor(private readonly resultsService: ResultsService) {}

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

    const archivosS3 = (response.Contents ?? []).map((objeto) => objeto.Key!);
    const resultados = await this.resultsService.buscarPorNombresArchivo(archivosS3);

    const resultadosMap = new Map<string, typeof resultados[0]>();
    for (const resultado of resultados) {
      resultadosMap.set(resultado.archivoOrigen, resultado);
      if (resultado.nombreTransformado) {
        resultadosMap.set(resultado.nombreTransformado, resultado);
      }
    }

    return archivosS3.map((key) => {
      const resultado = resultadosMap.get(key);
      if (resultado) {
        return {
          archivoActual: key,
          archivoOrigen: resultado.archivoOrigen,
          nombreTransformado: resultado.nombreTransformado ?? '-',
          estado: resultado.estado,
          batchId: resultado.batchId,
          ruleId: resultado.ruleId ?? '-',
          errorMessage: resultado.errorMessage ?? '-',
          processedAt: resultado.processedAt,
        };
      }
      return {
        archivoActual: key,
        archivoOrigen: '-',
        nombreTransformado: '-',
        estado: '-',
        batchId: '-',
        ruleId: '-',
        errorMessage: '-',
        processedAt: '-',
      };
    });
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
