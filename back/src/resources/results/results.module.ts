import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { DatabaseModule } from 'src/config/configOrm.module';
import { resultsProviders } from './results.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ResultsController],
  providers: [...resultsProviders, ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
