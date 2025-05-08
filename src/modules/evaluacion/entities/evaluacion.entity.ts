import { RubricaEntity } from './rubrica.entity';
//import { VideoJuegoEntity } from "src/modules/videojuego/entities/videojuego.entity";
import { ApiProperty } from '@nestjs/swagger';

export class EvaluacionEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  jurado_id: number;

  @ApiProperty()
  videojuego_id: number;

  @ApiProperty()
  comentarios?: string;

  @ApiProperty()
  create_at: Date;

  @ApiProperty()
  rubricas: RubricaEntity[];

  /*@ApiProperty()
  videojuego: VideojuegoEntity;*/

  constructor(partial: Partial<EvaluacionEntity>) {
    Object.assign(this, partial);
  }
}
