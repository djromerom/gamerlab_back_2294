import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminNrcService {
  constructor(private prisma: PrismaService) {}

  // Crear NRC
  async createNrc(data: { materia_id: number; profesor_id: number }) {
    console.log('DATA RECIBIDA:', data);
    return this.prisma.nRC.create({
      data: {
        materia_id: data.materia_id,
        profesor_id: data.profesor_id,
      },
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
      profesor: nrc.profesor.nombre_completo,
      create_at: nrc.create_at,
      update_at: nrc.update_at,
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
      profesor: nrc.profesor.nombre_completo,
      create_at: nrc.create_at,
      update_at: nrc.update_at,
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
      profesor: nrc.profesor.nombre_completo,
      create_at: nrc.create_at,
      update_at: nrc.update_at,
    }));
  }

  // Actualizar NRC
  async updateNrc(
    codigo_nrc: number,
    data: { materia_id?: number; profesor_id?: number },
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
}
