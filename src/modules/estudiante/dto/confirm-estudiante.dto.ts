import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEstudianteDto {
  @ApiProperty({
    description: 'Token de confirmación enviado por correo electrónico',
    example: 'a1b2c3d4e5f6g7h8i9j0'
  })
  @IsNotEmpty({ message: 'El token de confirmación es obligatorio' })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  token: string;
}
