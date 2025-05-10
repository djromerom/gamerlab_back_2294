import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateCriterioDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  ponderacion: number;
}
