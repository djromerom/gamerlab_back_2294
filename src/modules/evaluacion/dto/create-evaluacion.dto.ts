import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class RubricaDto {
  @IsInt()
  id_criterio: number;

  @IsInt()
  @Min(1)
  @Max(5)
  valoracion: number;
}

export class CreateEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  comentarios: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RubricaDto)
  rubricas: RubricaDto[];
}
