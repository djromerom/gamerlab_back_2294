import { Jurado as JuradoPrisma, EstadoJurado } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Usuario } from "@prisma/client";

export class JuradoEntity implements JuradoPrisma {
  @ApiProperty()
  id: number;

  @ApiProperty()
  id_user: number;

  @ApiProperty({ enum: EstadoJurado })
  estado: EstadoJurado;

  @ApiProperty()
  token_confirmacion: string;

  @ApiProperty()
  ultima_conexion: Date;

  @ApiProperty()
  create_at: Date;

  @ApiProperty()
  update_at: Date;

  @Exclude()
  deleted: boolean;

  @ApiProperty({ required: false })
  usuario?: Usuario;

  @ApiProperty({ isArray: true, required: false })
  evaluaciones?: any[];

  @ApiProperty({ isArray: true, required: false })
  asignaciones?: any[];

  constructor(partial: Partial<JuradoEntity>) {
    Object.assign(this, partial);
  }
}