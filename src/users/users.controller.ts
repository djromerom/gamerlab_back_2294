import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { UsuariosService } from './users.service'; // Asegúrate de esta ruta sea correcta
import { UsuarioDTO } from './dto/usuario.dto';
import { UsuarioEntity } from './entities/user.entity';

@Controller('usuarios')
@UseInterceptors(ClassSerializerInterceptor)
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post('createUsuario')
  createUsuario(@Body() data: UsuarioDTO) {
    return this.usuariosService.createUsuario(data);
  }

  @SerializeOptions({ type: UsuarioEntity })
  @Get('getUsuarios')
  getUsuarios() {
    return this.usuariosService.getUsuarios();
  }

  @SerializeOptions({ type: UsuarioEntity })
  @Get('getUsuarioById/:id')
  getUsuarioById(@Param('id') id: string) {
    return this.usuariosService.getUsuarioById(Number(id));
  }

  @SerializeOptions({ type: UsuarioEntity })
  @Put('updateUsuario/:id')
  updateUsuario(@Param('id') id: string, @Body() data: Partial<UsuarioDTO>) {
    return this.usuariosService.updateUsuario(Number(id), data);
  }

  @SerializeOptions({ type: UsuarioEntity })
  @Delete('deleteUsuario/:id')
  deleteUsuario(@Param('id') id: string) {
    return this.usuariosService.deleteUsuario(Number(id));
  }

  @Get('me/:id/equipos')
  getEquiposByUsuario(@Param('id') id: number) {
    return this.usuariosService.getEquiposbyNRC(id);
  }
}