import { DataSource } from 'typeorm';
import { ProcessingResult } from './entities/result.entity';

export const resultsProviders = [
  {
    provide: 'RESULTS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessingResult),
    inject: ['DATA_SOURCE'],
  },
];
