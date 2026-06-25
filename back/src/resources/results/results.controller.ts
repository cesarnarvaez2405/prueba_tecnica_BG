import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Guardar resultados de procesamiento' })
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.guardarResultados(createResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener resultados por batchId' })
  @ApiQuery({ name: 'batchId', description: 'UUID del lote procesado' })
  findByBatch(@Query('batchId') batchId: string) {
    return this.resultsService.buscarPorBatchId(batchId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen de un lote' })
  @ApiQuery({ name: 'batchId', description: 'UUID del lote procesado' })
  summary(@Query('batchId') batchId: string) {
    return this.resultsService.resumen(batchId);
  }
}
