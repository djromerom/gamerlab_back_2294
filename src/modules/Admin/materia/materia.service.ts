import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MateriaDTO } from './dto/materia.dto';

@Injectable()
export class MateriasService {
  constructor(private prismaService: PrismaService) {}

  async createMateria(data: MateriaDTO) {
    return this.prismaService.materia.create({
      data: {
        nombre: data.nombre,
        codigo: data.codigo,
        deleted: false,
      },
    });
  }

  async getMaterias() {
    return this.prismaService.materia.findMany({
      where: { deleted: false },
    });
  }

  async getMateriaById(id: number) {
    const materia = await this.prismaService.materia.findUnique({
      where: { id, deleted: false },
    });

    if (!materia) {
      throw new NotFoundException(`Materia con id ${id} no encontrada o inactiva`);
    }

    return materia;
  }

  async updateMateria(id: number, data: MateriaDTO) {
    await this.validateMateriaActiva(id);

    return this.prismaService.materia.update({
      where: { id },
      data,
    });
  }

  async deleteMateria(id: number) {
    await this.validateMateriaActiva(id);

    return this.prismaService.materia.update({
      where: { id },
      data: { deleted: true },
    });
  }

  private async validateMateriaActiva(id: number) {
    const materia = await this.prismaService.materia.findUnique({
      where: { id },
    });

    if (!materia || materia.deleted) {
      throw new NotFoundException(
        `Materia con id ${id} no encontrada o inactiva`,
      );
    }

    return materia;
  }
}