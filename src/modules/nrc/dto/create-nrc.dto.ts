import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNrcDto {

  @ApiProperty({description: 'Código NRC de la materia'})
  @IsNotEmpty()
  @IsNumber()
  @Length(4, 4)
  codigo_nrc: number;

  @ApiProperty({description: 'ID de la materia'})
  @IsNotEmpty()
  @IsNumber()
  materia_id: number;

  @ApiProperty({description: 'ID del profesor'})
  @IsNotEmpty()
  @IsNumber()
  profesor_id: number;
}
