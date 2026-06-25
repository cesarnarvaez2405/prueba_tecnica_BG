import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Repository } from 'typeorm';
import { Rule } from './entities/rule.entity';

@Injectable()
export class RulesService {
  constructor(
    @Inject('RULE_REPOSITORY')
    private readonly ruleRepository: Repository<Rule>,
  ) {}

  async crear(createRuleDto: CreateRuleDto) {
    const nuevaRule = this.ruleRepository.create(createRuleDto);
    return await this.ruleRepository.save(nuevaRule);
  }

  async buscarTodos(incluirInactivos: boolean = false) {
    if (incluirInactivos) {
      return await this.ruleRepository.find();
    }
    return await this.ruleRepository.find({ where: { isActive: true } });
  }

  async buscarPorId(id: string) {
    const rule = await this.ruleRepository.findOne({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException('No se encontro la rule');
    }

    return rule;
  }

  async actualizar(id: string, updateRuleDto: UpdateRuleDto) {
    const ruleAnterior = await this.buscarPorId(id);
    ruleAnterior.isActive = false;
    await this.ruleRepository.save(ruleAnterior);

    const nuevaRule = this.ruleRepository.create({
      ...ruleAnterior,
      ...updateRuleDto,
      id: undefined,
      isActive: true,
    });
    return await this.ruleRepository.save(nuevaRule);
  }

  async borrar(id: string) {
    const rule = await this.buscarPorId(id);
    rule.isActive = false;
    return await this.ruleRepository.save(rule);
  }
}
