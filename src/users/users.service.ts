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

  async getUsuarios(limit: number, offset: number) {
    return this.prismaService.usuario.findMany({
      where: { deleted: false },
      include: {
        nrcs: true
      },
      take: limit,
      skip: offset,
    });
  }

  async getUsuarioById(id: number) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id, deleted: false },
      include: {
        nrcs: true,
      },
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
      include: {
        nrcs: true,
      },
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

  async getEquiposbyNRC(id_user: number) {
    // validar que el usuario existe y no esta eliminado y sea un profesor
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id: id_user },
      include: {
        roles: true,
        nrcs: {
          include: {
            estudianteNrcs: {
              include: {
                estudiante: {
                  include: {
                    equipo: true,
                  },
                },
              },
            },
          }
        }
      },
    });

    if (!usuario || usuario.deleted) {
      throw new NotFoundException(`Usuario con id ${id_user} no encontrado o inactivo`);
    }

    // validar que el usuario sea un profesor
    const roles = usuario.roles.map((rol) => rol.id_rol);
    const informacionRol = await this.prismaService.rol.findMany({
      where: {
        id: { in: roles },
        deleted: false,
      },
    });

    const esProfesor = informacionRol.some((rol) => rol.nombre === 'PROFESOR');
    if (!esProfesor) {
      throw new NotFoundException(`Usuario con id ${id_user} no es un profesor`);
    }

    // obtener los estudiantes del usuario
    const nrcs = usuario.nrcs.filter((nrc) => !nrc.deleted);
    
    // obtener todos los equipos de los estudiantes
    const equipos = nrcs.flatMap((nrc) =>
      nrc.estudianteNrcs.map((estudianteNrc) => ({
        codigo_nrc: nrc.codigo_nrc,
        equipo: estudianteNrc.estudiante.equipo,
      })),
    );

    // filtrar los equipos que no son nulos
    const equiposFiltrados = equipos.filter((equipo) => equipo.equipo !== null);

    // eliminar duplicados
    const equiposUnicos = equiposFiltrados.filter((equipo, index, self) =>
      index === self.findIndex((e) => e.equipo.id === equipo.equipo.id),
    );

    // retornar los equipos
    return equiposUnicos.map((equipo) => ({
      id_equipo: equipo.equipo.id,
      nombre_equipo: equipo.equipo.nombre_equipo,
      codigo_nrc: equipo.codigo_nrc,
    }));
  }

  async getProfesores(limit: number, offset: number) {
    const usuarios = await this.prismaService.usuario.findMany({
      where: {
        deleted: false,
        roles: {
          some: {
            rol: {
              nombre: 'PROFESOR',
              deleted: false,
            }
          },
        },
      },
      include: {
        nrcs: true,
      },
      take: limit,
      skip: offset,
    });

    return usuarios.map((usuario) => ({
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
      nrcs: usuario.nrcs.map((nrc) => ({
        codigo_nrc: nrc.codigo_nrc,
        materia_id: nrc.materia_id,
      })),
    }));
  }
  
}