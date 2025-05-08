import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { Prisma, Estado } from '@prisma/client';

@Injectable()
export class EquipoService {
  constructor(private readonly prisma: PrismaService, private readonly exits: ValidationExitsService) {}

  async create(createEquipoDto: CreateEquipoDto) {
    const existingEquipo = await this.prisma.equipo.findUnique({
      where: {
        nombre_equipo: createEquipoDto.nombre_equipo,
        deleted: false,
      },
    });

    if (existingEquipo) {
      throw new HttpException('El equipo ya existe', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.equipo.create({
      data: createEquipoDto,
    });
  }

  async findAll(
    limit: number | null = null, 
    materiaId: number | null = null,
    codigoNrc: number | null = null,
  ) {
    // Si se proporciona un ID de materia, filtrar los equipos por ese ID
    const condiciones: Prisma.EquipoWhereInput[] = [];

    if (materiaId != null) {
      condiciones.push({
        estudiantes: {
          some: {
            deleted: false,
            estudianteNrcs: {
              some: {
                deleted: false,
                nrc: {
                  deleted: false,
                  materia_id: materiaId,
                },
              },
            },
          },
        },
      });
    }

    if (codigoNrc != null) {
      condiciones.push({
        estudiantes: {
          some: {
            deleted: false,
            estudianteNrcs: {
              some: {
                deleted: false,
                id_nrc: codigoNrc,
              },
            },
          },
        },
      });
    }

    const equipos = await this.prisma.equipo.findMany({
      where: condiciones.length > 0
        ? { AND: [{ deleted: false }, { OR: condiciones }] }
        : { deleted: false },   // sin filtros, devuelve todos los equipos no eliminados
      include: {
        estudiantes: {
          where: { deleted: false },
          include: {
            usuario: true,
            estudianteNrcs: {
              where: { deleted: false },
              include: {
                nrc: {
                  include: { materia: true },
                },
              },
            },
          },
        },
        videojuegos: {
          where: { deleted: false },
        },
      },
    });

    return equipos.slice(0, limit || undefined);
  }

  async findOne(id: number) {
    const equipo = await this.prisma.equipo.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    this.exits.validateExists('equipo', equipo);

    return equipo;
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto) {
    const equipo = await this.prisma.equipo.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    this.exits.validateExists('equipo', equipo);

    return this.prisma.equipo.update({
      where: {
        id: id,
        deleted: false,
      },
      data: updateEquipoDto,
    });
  }

  async remove(id: number) {
    const equipo = await this.prisma.equipo.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    this.exits.validateExists('equipo', equipo);


    // eliminar los videojuegos y estudiantes (NRCs tambien) relacionados
    this.prisma.videojuego.updateMany({
      where: {
        equipo_id: id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    });

    this.prisma.estudiante.updateMany({
      where: {
        equipo_id: id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    });

    return this.prisma.equipo.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }

  async updateEstado(idequipo: number, estado: Estado) {
    const equipo = await this.prisma.equipo.findUnique({
      where: {
        id: idequipo,
        deleted: false,
      },
    });

    this.exits.validateExists('equipo', equipo);

    return this.prisma.equipo.update({
      where: { id: idequipo },
      data: { estado },
    });
  }

  //funcion que valida si todos los estudiantes de un equipo están confirmados
  async allEstudiantesConfirmados(idEquipo: number): Promise<boolean> {
    const equipo = await this.prisma.equipo.findUnique({
      where: {
        id: idEquipo,
        deleted: false,
      },
      include: {
        estudiantes: {
          where: { deleted: false },
        },
      },
    });

    if (!equipo) {
      throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
    }

    return equipo.estudiantes.every((estudiante) => estudiante.confirmado);
  }
}
