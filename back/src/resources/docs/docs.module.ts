import { Module } from '@nestjs/common';
import { DocsService } from './docs.service';
import { DocsController } from './docs.controller';
import { DatabaseModule } from 'src/config/configOrm.module';
import { docsProviders } from './docs.providers';
import { ResultsModule } from '../results/results.module';

@Module({
  imports: [DatabaseModule, ResultsModule],
  controllers: [DocsController],
  providers: [...docsProviders, DocsService],
  exports: [DocsService],
})
export class DocsModule {}
