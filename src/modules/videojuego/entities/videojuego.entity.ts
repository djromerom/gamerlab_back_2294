import { Videojuego } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class VideoJuegoEntity implements Videojuego {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre_videojuego: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  equipo_id: number

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