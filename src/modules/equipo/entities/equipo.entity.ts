import { Equipo, Estado } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

type EquipoInterface = Omit<Equipo, 'deleted'>

export class EquipoEntity implements EquipoInterface {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  nombre_equipo: string;
  
  @ApiProperty()
  url_logo: string;
  
  @ApiProperty({enum: Estado, enumName: 'Estado'})
  estado: Estado;
  
  @ApiProperty()
  create_at: Date;
  
  @ApiProperty()
  update_at: Date;
}
