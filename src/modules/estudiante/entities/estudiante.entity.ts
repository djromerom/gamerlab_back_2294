import { Estudiante } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";


export class EstudianteEntity implements Estudiante {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Exclude()
  equipo_id: number;

  @ApiProperty()
  id_user: number;

  @ApiProperty()
  github: string;

  @ApiProperty()
  confirmado: boolean;

  @Exclude()
  create_at: Date;

  @Exclude()
  update_at: Date;

  @Exclude()
  deleted: boolean;

  @Exclude()
  token_confirmacion: string | null;
  
  constructor(partial: Partial<EstudianteEntity>) {
    Object.assign(this, partial);
  }
}