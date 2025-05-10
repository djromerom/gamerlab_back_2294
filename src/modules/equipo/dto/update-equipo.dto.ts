import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoDto } from './create-equipo.dto';
import { Estado } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEquipoDto extends PartialType(CreateEquipoDto)  {

  @ApiProperty({required: false})
  nombre_equipo?: string;
  
  @ApiProperty({required: false})
  url_logo?: string;
  
  @ApiProperty({required: false, enum: Estado, enumName: 'Estado'})
  estado?: Estado;
}
