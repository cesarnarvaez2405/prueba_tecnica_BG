import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RulesModule } from './resources/rules/rules.module';
import { DocsModule } from './resources/docs/docs.module';
import { ProcessorModule } from './resources/processor/processor.module';
import { ResultsModule } from './resources/results/results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    RulesModule,
    DocsModule,
    ProcessorModule,
    ResultsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
