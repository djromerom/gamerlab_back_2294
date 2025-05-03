import { Estudiante } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

type EstudianteInterface = Omit<Estudiante, 'deleted'>;

export class EstudianteEntity implements EstudianteInterface {
  @ApiProperty()
  id: number;

  @ApiProperty()
  equipo_id: number;

  @ApiProperty()
  id_user: number;

  @ApiProperty()
  github: string;

  @ApiProperty()
  confirmado: boolean;

  @ApiProperty()
  create_at: Date;

  @ApiProperty()
  update_at: Date;
}