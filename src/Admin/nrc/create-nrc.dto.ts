import { IsInt } from 'class-validator';

export class CreateNrcDto {
  @IsInt()
  materia_id: number;

  @IsInt()
  profesor_id: number;
}
