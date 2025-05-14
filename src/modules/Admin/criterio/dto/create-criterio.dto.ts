import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateCriterioDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  descripcion: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  @ApiProperty()
  ponderacion: number;
}
