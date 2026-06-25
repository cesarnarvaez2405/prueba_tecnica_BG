import { Controller, Param, Post, Sse } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ProcessorService } from './processor.service';

@ApiTags('Processor')
@Controller('processor')
export class ProcessorController {
  constructor(private readonly processorService: ProcessorService) {}

  @Post('start')
  @ApiOperation({ summary: 'Iniciar procesamiento de archivos via SQS' })
  start() {
    return this.processorService.iniciarProcesamiento();
  }

  @Sse('status/:batchId')
  @ApiOperation({ summary: 'SSE para recibir notificación cuando el procesamiento termine' })
  status(@Param('batchId') batchId: string): Observable<MessageEvent> {
    return this.processorService.obtenerStreamEstado(batchId);
  }
}
