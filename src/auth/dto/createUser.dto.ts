import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombre_completo: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional() 
  @IsString()
  rol: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
