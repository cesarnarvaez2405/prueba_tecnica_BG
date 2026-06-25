import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const ENV: string = process.env.ENVIRONMENT_PROJECT ?? 'dev';

const TYPEORM_ROUTE_FILES: any = {
  dev: {
    migrations: ['src/migration/**/*.ts'],
  },
  production: {
    migrations: ['dist/migration/**/*.js'],
  },
};
const { migrations } = TYPEORM_ROUTE_FILES[ENV];

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.HOST_DB,
        port: parseInt(process.env.PORT_DB!, 10) || 5432,
        username: process.env.USER_DB,
        password: process.env.PASS_DB,
        database: process.env.NAME_DB,
        migrations,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
        ssl:
          process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      });

      console.info('🐬 Conectado a la DB:', dataSource.options.database);
      return dataSource.initialize();
    },
  },
];
