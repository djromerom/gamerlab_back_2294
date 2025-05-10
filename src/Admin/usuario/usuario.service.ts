import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioDTO } from './dto/usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prismaService: PrismaService) {}

  async createUsuario(data: UsuarioDTO) {
    return this.prismaService.usuario.create({
      data: {
        nombre_completo: data.nombre_completo,
        email: data.email,
        hash_contrasena: data.hash_contrasena,
        deleted: false,
      },
    });
  }

  async getUsuarios() {
    return this.prismaService.usuario.findMany({
      where: { deleted: false },
    });
  }

  async getUsuarioById(id: number) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id, deleted: false },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado o inactivo`);
    }

    return usuario;
  }

  async updateUsuario(id: number, data: Partial<UsuarioDTO>) {
    await this.validateUsuarioActivo(id);

    return this.prismaService.usuario.update({
      where: { id },
      data,
    });
  }

  async deleteUsuario(id: number) {
    await this.validateUsuarioActivo(id);

    return this.prismaService.usuario.update({
      where: { id },
      data: { deleted: true },
    });
  }

  private async validateUsuarioActivo(id: number) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id },
    });

    if (!usuario || usuario.deleted) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado o inactivo`);
    }

    return usuario;
  }
}