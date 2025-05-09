import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RubricaDto {
  @ApiProperty()
  @IsInt()
  id_criterio: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  valoracion: number;
}

export class CreateEvaluacionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comentarios: string;

  @ApiProperty({ type: [RubricaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RubricaDto)
  rubricas: RubricaDto[];
}

