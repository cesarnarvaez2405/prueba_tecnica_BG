import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { DatabaseModule } from 'src/config/configOrm.module';
import { rulesProviders } from './rules.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RulesController],
  providers: [...rulesProviders, RulesService],
  exports: [RulesService],
})
export class RulesModule {}
