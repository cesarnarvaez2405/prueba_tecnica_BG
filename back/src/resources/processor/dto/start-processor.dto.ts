import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StartProcessorDto {
  @ApiProperty({
    description: 'Lista de keys de archivos en S3 a procesar',
    example: ['PHO_CD_DES_20260430.txt', 'cuotas_bdb_20260430.txt'],
  })
  @IsArray({ message: 'El campo fileKeys debe ser un array' })
  @IsString({ each: true, message: 'Cada fileKey debe ser un string' })
  @IsNotEmpty({ message: 'El campo fileKeys es obligatorio' })
  readonly fileKeys!: string[];
}
