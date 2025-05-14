import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsArray, IsInt, Length } from "class-validator";

export class CreateEstudianteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({required: true, description: 'Nombre y Apellido del estudiante'})
  nombre_completo: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({host_whitelist: ['uninorte.edu.co']})
  @ApiProperty({required: true})
  email: string;


  @IsString()
  @IsNotEmpty()
  @ApiProperty({required: true})
  github: string;

  @ApiProperty({required:true})
  @IsArray()
  @IsNotEmpty()
  @IsInt({each: true})
  @Length(4, 4, {each: true})
  NRCs: number[];
}