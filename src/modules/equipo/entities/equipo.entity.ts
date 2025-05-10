import { Estado, Videojuego } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { VideoJuegoEntity } from "src/modules/videojuego/entities/videojuego.entity";
import { EstudianteEntity } from "src/modules/estudiante/entities/estudiante.entity";
import { ValidateNested } from "class-validator";

export class EquipoEntity {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  nombre_equipo: string;
  
  @ApiProperty()
  url_logo: string;
  
  @ApiProperty({enum: Estado, enumName: 'Estado'})
  estado: Estado;

  @ApiProperty( { type: [VideoJuegoEntity] })
  @ValidateNested({ each: true })
  @Type(() => VideoJuegoEntity)
  videojuegos: VideoJuegoEntity[];

  @ApiProperty( { type: [EstudianteEntity] })
  @ValidateNested({ each: true })
  @Type(() => EstudianteEntity)
  estudiantes: EstudianteEntity[];
  
  @Exclude()
  create_at: Date;
  
  @Exclude()
  update_at: Date;

  @Exclude()
  deleted: boolean;

  constructor(partial: Partial<EquipoEntity>) {
    Object.assign(this, partial);
  }
}
