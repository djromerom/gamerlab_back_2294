import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateCriterioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ponderacion?: number;
}
