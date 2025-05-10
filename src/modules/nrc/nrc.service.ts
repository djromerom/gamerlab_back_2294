import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNrcDto } from './dto/create-nrc.dto';
import { UpdateNrcDto } from './dto/update-nrc.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NrcService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNrcDto: CreateNrcDto) {
    this.prisma.$transaction(async (prisma) => {
      // validar que el profesor exista
      const profesor = await prisma.usuario.findUnique({
        where: { id: createNrcDto.profesor_id, deleted: false },
      });
      if (!profesor) {
        throw new HttpException('Profesor no encontrado', HttpStatus.NOT_FOUND);
      }
  
      // validar que la materia exista
      const materia = await prisma.materia.findUnique({
        where: { id: createNrcDto.materia_id, deleted: false },
      });
      if (!materia) {
        throw new HttpException('Materia no encontrada', HttpStatus.NOT_FOUND);
      }
  
      // validar que el NRC no exista
      const nrcExistente = await prisma.nRC.findUnique({
        where: { codigo_nrc: createNrcDto.codigo_nrc, deleted: false },
      });
      if (nrcExistente) {
        throw new HttpException('NRC ya existe', HttpStatus.CONFLICT);
      }

      // crear el NRC
      const nrc = await prisma.nRC.create({
        data: {
          codigo_nrc: createNrcDto.codigo_nrc,
          materia_id: createNrcDto.materia_id,
          profesor_id: createNrcDto.profesor_id,
        },
      });
      return nrc;
    }).catch((error) => {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Error al crear el NRC', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }

  findAll() {
    return this.prisma.nRC.findMany({
      where: { deleted: false },
      include: {
        materia: true,
        profesor: true,
      },
    });
  }

  async findOne(id: number) {
    const nrc = await this.prisma.nRC.findUnique({
      where: { codigo_nrc: id, deleted: false },
      include: {
        materia: true,
        profesor: true,
      },
    });
    if (!nrc) {
      throw new HttpException('NRC no encontrado', HttpStatus.NOT_FOUND);
    }
    return nrc;
  }

  async update(id: number, updateNrcDto: UpdateNrcDto) {
    // validar que el NRC exista  
    const nrcExistente = await this.prisma.nRC.findUnique({
      where: { codigo_nrc: id, deleted: false },
    });

    if (!nrcExistente) {
      throw new HttpException('NRC no encontrado', HttpStatus.NOT_FOUND);
    }

    // validar que el profesor exista
    const profesor = await this.prisma.usuario.findUnique({
      where: { id: updateNrcDto.profesor_id, deleted: false },
    });
    if (!profesor) {
      throw new HttpException('Profesor no encontrado', HttpStatus.NOT_FOUND);
    }

    // validar que la materia exista
    const materia = await this.prisma.materia.findUnique({
      where: { id: updateNrcDto.materia_id, deleted: false },
    });
    if (!materia) {
      throw new HttpException('Materia no encontrada', HttpStatus.NOT_FOUND);
    }


    const nrc = await this.prisma.nRC.update({
      where: { codigo_nrc: id, deleted: false },
      data: {
        materia_id: updateNrcDto.materia_id,
        profesor_id: updateNrcDto.profesor_id,
      },
    }).catch((error) => {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Error al actualizar el NRC', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
    return nrc;
  }

  async remove(id: number) {
    // validar que el NRC exista
    const nrcExistente = await this.prisma.nRC.findUnique({
      where: { codigo_nrc: id, deleted: false },
    });
    if (!nrcExistente) {
      throw new HttpException('NRC no encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.nRC.update({
        where: { codigo_nrc: id, deleted: false },
        data: { deleted: true },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Error al eliminar el NRC', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
