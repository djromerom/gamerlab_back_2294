import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginUserDto } from './dto/LoginUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ActivateDto } from './dto/activate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() usuario: LoginUserDto) {
    console.log('Datos recibidos:', usuario);
    return this.authService.signIn(usuario.email, usuario.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
async signUp(@Body() usuario: CreateUserDto) {
  return this.authService.signUp(usuario);
}


  @HttpCode(HttpStatus.OK)
  @Post('activate')
  async activate(@Body() usuario: ActivateDto) {
    const { token, password } = usuario;
    return this.authService.createPasswordHash(password, token);
  }
}
 
