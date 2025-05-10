import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from './guards/auth.guard';

interface UserDTO {
  nombre_completo: string;
  email: string;
  password: string;
}
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Get('users')
  getUsers() {
    return this.authService.getUsers();

  }
  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() usuario: UserDTO) {
    return this.authService.signIn(usuario.email, usuario.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() usuario: UserDTO) {
    const { nombre_completo, email, password } = usuario;
    return this.authService.signUp(nombre_completo, email, password);
  }
}
 
