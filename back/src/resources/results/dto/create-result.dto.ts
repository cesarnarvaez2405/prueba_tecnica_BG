import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateResultItemDto {
  @ApiProperty({ description: 'Nombre original del archivo' })
  @IsString()
  @IsNotEmpty()
  readonly archivoOrigen!: string;

  @ApiPropertyOptional({ description: 'Nombre transformado del archivo' })
  @IsString()
  @IsOptional()
  readonly nombreTransformado?: string;

  @ApiProperty({ description: 'Estado del procesamiento', example: 'TRANSFORMADO' })
  @IsString()
  @IsNotEmpty()
  readonly estado!: string;

  @ApiPropertyOptional({ description: 'UUID de la rule aplicada' })
  @IsUUID()
  @IsOptional()
  readonly ruleId?: string;

  @ApiPropertyOptional({ description: 'Mensaje de error si aplica' })
  @IsString()
  @IsOptional()
  readonly errorMessage?: string;
}

export class CreateResultDto {
  @ApiProperty({ description: 'UUID del lote procesado' })
  @IsUUID()
  @IsNotEmpty()
  readonly batchId!: string;

  @ApiProperty({ description: 'Lista de resultados del procesamiento', type: [CreateResultItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  readonly resultados!: CreateResultItemDto[];
}
