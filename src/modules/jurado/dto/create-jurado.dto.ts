import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EstadoJurado } from "@prisma/client";

export class CreateJuradoDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'ID del usuario asociado al jurado' })
  id_user: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'Token único para confirmación por correo' })
  token_confirmacion: string;

  @IsEnum(EstadoJurado)
  @IsOptional()
  @ApiProperty({ 
    required: false, 
    enum: EstadoJurado, 
    default: EstadoJurado.no_confirmado,
    description: 'Estado del jurado (confirmado o no confirmado)' 
  })
  estado?: EstadoJurado;
}