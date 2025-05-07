import { PartialType } from '@nestjs/mapped-types';
import { CreateVideojuegoDto } from './create-videojuego.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVideojuegoDto extends PartialType(CreateVideojuegoDto) {
  @ApiProperty({ required: false })
  nombre_videojuego?: string;

  @ApiProperty({ required: false })
  descripcion?: string;

  @ApiProperty({ required: false })
  equipo_id?: number;
}
