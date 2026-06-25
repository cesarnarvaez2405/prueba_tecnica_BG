import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@ApiTags('Rules')
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva rule' })
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.crear(createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las rules' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Incluir rules inactivas en el resultado',
  })
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.rulesService.buscarTodos(includeInactive === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una rule por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la rule' })
  findOne(@Param('id') id: string) {
    return this.rulesService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una rule por ID (genera historial)' })
  @ApiParam({ name: 'id', description: 'UUID de la rule' })
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesService.actualizar(id, updateRuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una rule por ID (borrado lógico)' })
  @ApiParam({ name: 'id', description: 'UUID de la rule' })
  remove(@Param('id') id: string) {
    return this.rulesService.borrar(id);
  }
}
