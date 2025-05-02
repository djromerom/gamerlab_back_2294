import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';

@Injectable()
export class EvaluacionService {
  constructor(private prisma: PrismaService) {}

  async getVideojuegosAsignados(juradoId: number) {
    return this.prisma.videojuego.findMany({
      where: {
        asignaciones: {
          some: { id_jurado: juradoId },
        },
        evaluaciones: {
          none: { jurado_id: juradoId },
        },
      },
      include: {
        equipo: true,
      },
    });
  }

  async crearEvaluacion(juradoId: number, videojuegoId: number, dto: CreateEvaluacionDto) {
    const yaAsignado = await this.prisma.videojuegoAsignado.findUnique({
      where: {
        id_videojuego_id_jurado: {
          id_videojuego: videojuegoId,
          id_jurado: juradoId,
        },
      },
    });

    if (!yaAsignado) {
      throw new BadRequestException('No tienes permiso para evaluar este videojuego.');
    }

    const yaEvaluado = await this.prisma.evaluacion.findUnique({
      where: {
        jurado_id_videojuego_id: {
          jurado_id: juradoId,
          videojuego_id: videojuegoId,
        },
      },
    });

    if (yaEvaluado) {
      throw new BadRequestException('Ya has evaluado este videojuego.');
    }

    const evaluacion = await this.prisma.evaluacion.create({
      data: {
        jurado_id: juradoId,
        videojuego_id: videojuegoId,
        comentarios: dto.comentarios,
        rubricas: {
          createMany: {
            data: dto.rubricas.map(r => ({
              id_criterio: r.id_criterio,
              valoracion: r.valoracion,
            })),
          },
        },
      },
    });

    return evaluacion;
  }
}
