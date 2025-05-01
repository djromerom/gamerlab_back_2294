import { Injectable } from '@nestjs/common';
import { CreateVideojuegoDto } from './dto/create-videojuego.dto';
import { UpdateVideojuegoDto } from './dto/update-videojuego.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';

@Injectable()
export class VideojuegoService {
  constructor(private prisma: PrismaService, private validationExits: ValidationExitsService) {}

  async create(createVideojuegoDto: CreateVideojuegoDto) {
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        equipo_id: createVideojuegoDto.equipo_id,
        deleted: false,
      }
    });

    if (videojuego) {
      throw new Error('El videojuego ya existe');
    }


    return this.prisma.videojuego.create({
      data: createVideojuegoDto,
    });
  }

  findAll() {
    return this.prisma.videojuego.findMany({
      where: {
        deleted: false,
      },
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
