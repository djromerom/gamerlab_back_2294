import { PartialType } from '@nestjs/swagger';
import { CreateJuradoDto } from './create-jurado.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoJurado } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateJuradoDto extends PartialType(CreateJuradoDto) {
  @IsEnum(EstadoJurado)
  @IsOptional()
  @ApiProperty({ 
    required: false, 
    enum: EstadoJurado, 
    description: 'Estado del jurado (confirmado o no confirmado)' 
  })
  estado?: EstadoJurado;

  @IsString()
  @IsOptional()
  @ApiProperty({ 
    required: false, 
    description: 'Token de confirmación' 
  })
  token_confirmacion?: string;
}