import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';
import { DocsService } from '../docs/docs.service';
import { RulesService } from '../rules/rules.service';

@Injectable()
export class ProcessorService {
  private readonly sqsClient = new SQSClient({
    region: process.env.AWS_S3_REGION,
  });

  constructor(
    private readonly docsService: DocsService,
    private readonly rulesService: RulesService,
  ) {}

  async iniciarProcesamiento() {
    const archivos = await this.docsService.listarArchivos();
    const fileKeys = archivos.map((archivo) => archivo.key);
    const rules = await this.rulesService.buscarTodos();

    const batchId = uuidv4();

    const mensaje = {
      batchId,
      fileKeys,
      rules,
    };

    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify(mensaje),
      }),
    );

    return {
      batchId,
      archivosEnviados: fileKeys.length,
      estado: 'ENVIADO_A_SQS',
    };
  }
}
