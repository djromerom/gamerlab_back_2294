import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCriterioDto } from './dto/create-criterio.dto';
import { UpdateCriterioDto } from './dto/update-criterio.dto';

@Injectable()
export class CriterioService {
  constructor(private prisma: PrismaService) {}

  async createCriterio(data: CreateCriterioDto) {
    return this.prisma.criterio.create({
      data: { ...data },
    });
  }

  async getCriterios() {
    return this.prisma.criterio.findMany({
      where: { deleted: false },
    });
  }

  async getCriterioById(id_criterio: number) {
    const criterio = await this.prisma.criterio.findUnique({
      where: { id: id_criterio },
    });

    if (!criterio || criterio.deleted) {
      throw new NotFoundException(
        `Criterio con id ${id_criterio} no encontrado o eliminado`,
      );
    }

    return criterio;
  }

  async updateCriterio(id_criterio: number, data: UpdateCriterioDto) {
    await this.validarCriterioActivo(id_criterio);

    return this.prisma.criterio.update({
      where: { id: id_criterio },
      data,
    });
  }

  async deleteCriterio(id_criterio: number) {
    await this.validarCriterioActivo(id_criterio);

    return this.prisma.criterio.update({
      where: { id: id_criterio },
      data: { deleted: true },
    });
  }

  private async validarCriterioActivo(id_criterio: number) {
    const criterio = await this.prisma.criterio.findUnique({
      where: { id: id_criterio },
    });

    if (!criterio || criterio.deleted) {
      throw new NotFoundException(
        `Criterio con id ${id_criterio} no encontrado o eliminado`,
      );
    }

    return criterio;
  }
}
