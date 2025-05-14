import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class CreateEmailProfesorDto {

  @ApiProperty()
  @IsEmail({}, { message: 'El correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'El token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  token: string;

}