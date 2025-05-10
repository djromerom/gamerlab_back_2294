import { IsInt } from 'class-validator';

export class CreateNrcDto {
  @IsInt()
  codigo_nrc: number;

  @IsInt()
  materia_id: number;

  @IsInt()
  profesor_id: number;
}
