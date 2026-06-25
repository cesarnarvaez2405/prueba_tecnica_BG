import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Rule } from '../entities/rule.entity';
import { DateFormatEnum } from '../enums/date-format.enum';

interface ICreateRuleDto
  extends Pick<Rule, 'pattern' | 'dateFormat' | 'outTemplate' | 'priority' | 'isActive'> {}

export class CreateRuleDto implements ICreateRuleDto {
  @ApiProperty({ description: 'Patrón de la regla', example: 'FAC-{date}-{seq}' })
  @IsString({ message: 'El campo pattern debe ser un string' })
  @IsNotEmpty({ message: 'El campo pattern es obligatorio' })
  readonly pattern!: string;

  @ApiProperty({ description: 'Formato de fecha', enum: DateFormatEnum, example: DateFormatEnum.AAAAMMDD })
  @IsEnum(DateFormatEnum, { message: 'El campo date_format debe ser un formato válido' })
  @IsNotEmpty({ message: 'El campo date_format es obligatorio' })
  readonly dateFormat!: DateFormatEnum;

  @ApiProperty({ description: 'Plantilla de salida', example: '{pattern}-{date}' })
  @IsString({ message: 'El campo out_template debe ser un string' })
  @IsNotEmpty({ message: 'El campo out_template es obligatorio' })
  readonly outTemplate!: string;

  @ApiPropertyOptional({ description: 'Prioridad de la regla', example: 1, default: 1 })
  @IsNumber({}, { message: 'El campo priority debe ser un número' })
  @IsOptional()
  readonly priority!: number;

  @ApiPropertyOptional({ description: 'Estado de la regla', example: true, default: true })
  @IsBoolean({ message: 'El campo is_active debe ser un booleano' })
  @IsOptional()
  readonly isActive!: boolean;
}
