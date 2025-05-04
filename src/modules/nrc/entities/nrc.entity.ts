import { ApiProperty } from "@nestjs/swagger";
import { Materia, Usuario } from "@prisma/client";
import { Exclude } from "class-transformer";

export class NrcEntity {
  
  @ApiProperty({description: 'Código NRC de la materia'})
  codigo_nrc: number;
  
  @ApiProperty({description: 'ID de la materia'})
  @Exclude()
  materia_id: number;

  @ApiProperty({description: 'ID de la materia'})
  materia: Materia;

  @ApiProperty({description: 'ID del profesor'})
  @Exclude()
  profesor_id: number;

  @ApiProperty({description: 'ID del profesor'})
  profesor: Usuario;


  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
  
  @Exclude()
  deleted_at: Date;

  constructor(partial: Partial<NrcEntity>) {
    Object.assign(this, partial);
  }

}
