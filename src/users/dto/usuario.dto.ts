import { IsArray, IsEmail, ArrayNotEmpty, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Roles {
  ESTUDIANTE = 'ESTUDIANTE',
  PROFESOR = 'PROFESOR',
  JURADO = 'JURADO',
}

export class UsuarioDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hash_contrasena: string;

  @ApiProperty( { isArray: true, enum: Roles, enumName: 'Roles' })
  @IsArray()
  @IsString( { each: true })
  @ArrayNotEmpty( { each: true })
  @IsEnum(Roles, { each: true })
  Roles: Roles[];
}