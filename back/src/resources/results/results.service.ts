import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { In, Repository } from 'typeorm';
import { ProcessingResult } from './entities/result.entity';
import { CreateResultDto } from './dto/create-result.dto';

@Injectable()
export class ResultsService {
  constructor(
    @Inject('RESULTS_REPOSITORY')
    private readonly resultsRepository: Repository<ProcessingResult>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async guardarResultados(createResultDto: CreateResultDto) {
    const entidades = createResultDto.resultados.map((item) =>
      this.resultsRepository.create({
        batchId: createResultDto.batchId,
        ...item,
      }),
    );

    const guardados = await this.resultsRepository.save(entidades);

    this.eventEmitter.emit('processing.completed', {
      batchId: createResultDto.batchId,
      total: guardados.length,
      transformados: guardados.filter((e) => e.estado === 'TRANSFORMADO').length,
      errores: guardados.filter((e) => e.estado === 'ERROR').length,
      noMapeados: guardados.filter((e) => e.estado === 'NO_MAPEADO').length,
    });

    return guardados;
  }

  async buscarPorBatchId(batchId: string) {
    const resultados = await this.resultsRepository.find({
      where: { batchId },
      relations: { rule: true },
    });

    if (!resultados.length) {
      throw new NotFoundException('No se encontraron resultados para este batchId');
    }

    return resultados;
  }

  async buscarPorNombresArchivo(nombres: string[]) {
    if (!nombres.length) return [];
    return await this.resultsRepository.find({
      where: [
        { archivoOrigen: In(nombres) },
        { nombreTransformado: In(nombres) },
      ],
      relations: { rule: true },
    });
  }

  async resumen(batchId: string) {
    const resultados = await this.buscarPorBatchId(batchId);

    return {
      batchId,
      total: resultados.length,
      transformados: resultados.filter((r) => r.estado === 'TRANSFORMADO').length,
      errores: resultados.filter((r) => r.estado === 'ERROR').length,
      noMapeados: resultados.filter((r) => r.estado === 'NO_MAPEADO').length,
    };
  }
}
