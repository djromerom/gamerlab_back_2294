import { Videojuego } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

type VideojuegoInterface = Omit<Videojuego, 'deleted'>

export class VideoJuegoEntity implements VideojuegoInterface {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre_videojuego: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  equipo_id: number

  @ApiProperty()
  create_at: Date;  

  @ApiProperty()
  update_at: Date;
}