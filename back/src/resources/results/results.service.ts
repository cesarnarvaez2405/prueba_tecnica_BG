import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProcessingResult } from './entities/result.entity';
import { CreateResultDto } from './dto/create-result.dto';

@Injectable()
export class ResultsService {
  constructor(
    @Inject('RESULTS_REPOSITORY')
    private readonly resultsRepository: Repository<ProcessingResult>,
  ) {}

  async guardarResultados(createResultDto: CreateResultDto) {
    const entidades = createResultDto.resultados.map((item) =>
      this.resultsRepository.create({
        batchId: createResultDto.batchId,
        ...item,
      }),
    );

    return await this.resultsRepository.save(entidades);
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
