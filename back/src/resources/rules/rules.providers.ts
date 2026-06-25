import { DataSource } from 'typeorm';
import { Rule } from './entities/rule.entity';

export const rulesProviders = [
  {
    provide: 'RULE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Rule),
    inject: ['DATA_SOURCE'],
  },
];
