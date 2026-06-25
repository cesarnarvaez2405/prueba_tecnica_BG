import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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
}
