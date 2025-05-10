import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { Estado } from '@prisma/client';

export class CreateEquipoDto {
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({required: true})
  nombre_equipo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({required: true})
  url_logo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({required: false, enum: Estado, enumName: 'Estado'})
  estado?: Estado;

}
