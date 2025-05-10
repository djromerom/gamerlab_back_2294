
import { IsEmail, IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateEmailJuradoDto {

  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsString({ message: 'Cada correo electrónico debe ser una cadena de texto' })
  @IsEmail()
  email: string;

  @IsString({ message: 'El token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  token: string;

}