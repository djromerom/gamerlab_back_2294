import { Videojuego } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { EvaluacionEntity } from "src/modules/evaluacion/entities/evaluacion.entity";
import { ValidateNested } from "class-validator";

export class VideoJuegoEntity implements Videojuego {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre_videojuego: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  equipo_id: number

  @ApiProperty({ type: [EvaluacionEntity] })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => EvaluacionEntity)
  evaluaciones: EvaluacionEntity[];

  @Exclude()
  create_at: Date;  

  @Exclude()
  update_at: Date;

  @Exclude()
  deleted: boolean;

  constructor(partial: Partial<VideoJuegoEntity>) {
    Object.assign(this, partial);
  }
}