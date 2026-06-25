import { Module } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { ProcessorController } from './processor.controller';
import { DocsModule } from '../docs/docs.module';
import { RulesModule } from '../rules/rules.module';

@Module({
  imports: [DocsModule, RulesModule],
  controllers: [ProcessorController],
  providers: [ProcessorService],
})
export class ProcessorModule {}
