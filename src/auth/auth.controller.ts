import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guards/auth.guard';
import { LoginUserDto } from './dto/LoginUser.dto';

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
  logIn(@Body() usuario: LoginUserDto) {
    return this.authService.signIn(usuario.email, usuario.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() usuario: LoginUserDto) {
    const { nombre_completo, email, password } = usuario;
    return this.authService.signUp(nombre_completo, email, password);
  }
}
 
