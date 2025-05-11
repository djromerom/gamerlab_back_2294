import { Estudiante } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { UsuarioEntity } from "src/users/entities/user.entity";


export class EstudianteEntity implements Estudiante {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Exclude()
  equipo_id: number;

  @Exclude()
  id_user: number;

  @ApiProperty()
  @Expose()
  @Type(() => UsuarioEntity)
  usuario: UsuarioEntity;

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

  @Expose()
  @ApiProperty()
  @ValidateNested({ each: true })
  estudianteNrcs: any[];
  
  constructor(partial: Partial<EstudianteEntity>) {
    Object.assign(this, partial);
  }
}