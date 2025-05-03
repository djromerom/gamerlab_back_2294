import { Injectable } from '@nestjs/common';
import { CreateVideojuegoDto } from './dto/create-videojuego.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuego.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';

@Injectable()
export class VideojuegoService {
  constructor(private prisma: PrismaService, private validationExits: ValidationExitsService) {}

  async create(createVideojuegoDto: CreateVideojuegoDto) {
    // Verificar si el equipo existe en la base de datos
    const equipo = await this.prisma.equipo.findFirst({
      where: {
        id: createVideojuegoDto.equipo_id,
        deleted: false,
      },
    });
    this.validationExits.validateExists('equipo', equipo);
    
    // Verificar si el videojuego ya existe en la base de datos
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        equipo_id: createVideojuegoDto.equipo_id,
        deleted: false,
      }
    });

    if (videojuego) {
      throw new Error('El videojuego ya existe');
    }

    // Crear el videojuego
    return this.prisma.videojuego.create({
      data: createVideojuegoDto,
    });
  }

  findAll(
    limit: number | null = null,
    equipo_id: number | null = null
  ) {
    // Si se proporciona un ID de equipo, filtrar los videojuegos por ese equipo
    if (equipo_id) {
      return this.prisma.videojuego.findMany({
        where: {
          deleted: false,
          equipo_id: equipo_id,
        },
        take: limit || undefined,
      });
    }
    // Si no se proporciona un ID de equipo, devolver todos los videojuegos
    return this.prisma.videojuego.findMany({
      where: {
        deleted: false,
      },
      take: limit || undefined,
    });
  }

  async findOne(id: number) {
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        id,
        deleted: false,
      },
    });

    this.validationExits.validateExists('videojuego', videojuego);

    return videojuego;
  }

  async update(id: number, updateVideojuegoDto: UpdateVideojuegoDto) {
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        id,
        deleted: false,
      },
    });

    this.validationExits.validateExists('videojuego', videojuego);

    return this.prisma.videojuego.update({
      where: {
        id,
      },
      data: updateVideojuegoDto,
    });
  }

  async remove(id: number) {
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        id,
        deleted: false,
      },
    });

    this.validationExits.validateExists('videojuego', videojuego);

    return this.prisma.videojuego.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }
}
