import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNrcDto } from './dto/create-nrc.dto';

@Injectable()
export class AdminNrcService {
  constructor(private prisma: PrismaService) {}

  // Crear NRC
  async createNrc(data: CreateNrcDto) {
    // Validar que el NRC no exista
    const existingNrc = await this.prisma.nRC.findUnique({
      where: {
        codigo_nrc: data.codigo_nrc,
        deleted: false,
      },
    });

    if (existingNrc) {
      throw new NotFoundException(`NRC con id ${data.codigo_nrc} ya existe`);
    }

    // Validar que la materia y el profesor existan
    const materia = await this.prisma.materia.findUnique({
      where: { id: data.materia_id },
    });

    if (data.profesor_id) {
      const profesor = await this.prisma.usuario.findUnique({
        where: { id: data.profesor_id },
      });
      if (!profesor) {
        throw new NotFoundException(`Profesor con id ${data.profesor_id} no encontrado`);
      }
    }

    if (!materia) {
      throw new NotFoundException(`Materia con id ${data.materia_id} no encontrada`);
    }

    console.log('DATA RECIBIDA:', data);
    return this.prisma.nRC.create({
      data: {
        codigo_nrc: data.codigo_nrc,
        materia_id: data.materia_id,
        profesor_id: data?.profesor_id,
      }
    });
  }

  // Obtener todos los NRCs activos (no eliminados)
  async getNrcs() {
    const nrcs = await this.prisma.nRC.findMany({
      where: {
        deleted: false,
      },
      include: {
        materia: true,
        profesor: true
      },
    });

    return nrcs.map((nrc) => ({
      codigo_nrc: nrc.codigo_nrc,
      materia: nrc.materia.nombre,
      profesor: nrc.profesor?.nombre_completo,
    }));
  }

  // Obtener NRC por ID
  async getNrcById(codigo_nrc: number) {
    const nrc = await this.prisma.nRC.findUnique({
      where: { codigo_nrc },
      include: {
        materia: true,
        profesor: true,
      },
    });

    if (!nrc || nrc.deleted) {
      throw new NotFoundException(`NRC con id ${codigo_nrc} no encontrado o inactivo`);
    }

    return {
      codigo_nrc: nrc.codigo_nrc,
      materia: nrc.materia.nombre,
      profesor: nrc.profesor?.nombre_completo,
    };
  }

  // Obtener NRCs por materia
  async getNrcByMateria(materia_id: number) {
    const nrcs = await this.prisma.nRC.findMany({
      where: {
        materia_id,
        deleted: false,
      },
      include: {
        profesor: true,
      },
    });

    return nrcs.map((nrc) => ({
      codigo_nrc: nrc.codigo_nrc,
      profesor: nrc.profesor?.nombre_completo,
    }));
  }

  // Actualizar NRC
  async updateNrc(
    codigo_nrc: number,
    data: Partial<CreateNrcDto>,
  ) {
    await this.validarNrcActivo(codigo_nrc);

    return this.prisma.nRC.update({
      where: { codigo_nrc },
      data,
    });
  }

  // Eliminar (soft delete) NRC
  async deleteNrc(codigo_nrc: number) {
    await this.validarNrcActivo(codigo_nrc);

    return this.prisma.nRC.update({
      where: { codigo_nrc },
      data: { deleted: true },
    });
  }

  // Validar si NRC está activo (no eliminado)
  private async validarNrcActivo(codigo_nrc: number) {
    const nrc = await this.prisma.nRC.findUnique({
      where: { codigo_nrc },
    });

    if (!nrc || nrc.deleted) {
      throw new NotFoundException(`NRC con id ${codigo_nrc} no encontrado o inactivo`);
    }

    return nrc;
  }

  // Asignar profesor a un NRC
  async asignarProfesor(codigo_nrc: number, profesor_id: number) {
    await this.validarNrcActivo(codigo_nrc);

    const profesor = await this.prisma.usuario.findUnique({
      where: { id: profesor_id },
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con id ${profesor_id} no encontrado`);
    }

    return this.prisma.nRC.update({
      where: { codigo_nrc },
      data: { profesor_id },
    });
  }
}
