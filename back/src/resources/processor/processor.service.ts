import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async iniciarProcesamiento() {
    const archivos = await this.docsService.listarArchivos();
    const fileKeys = archivos.map((archivo) => archivo.archivoActual);
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

  obtenerStreamEstado(batchId: string): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      const handler = (payload: { batchId: string }) => {
        if (payload.batchId === batchId) {
          subscriber.next({ data: payload } as unknown as MessageEvent);
          subscriber.complete();
        }
      };

      this.eventEmitter.on('processing.completed', handler);

      return () => {
        this.eventEmitter.off('processing.completed', handler);
      };
    });
  }
}
