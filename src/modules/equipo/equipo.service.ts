import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';

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

  findAll() {
    return this.prisma.equipo.findMany({
      where: {
        deleted: false,
      },
    })
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

    return this.prisma.equipo.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }
}
