import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNrcDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  codigo_nrc: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  materia_id: number;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  profesor_id: number | null;
}
