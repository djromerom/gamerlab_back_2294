import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { plainToInstance } from 'class-transformer';
import { EvaluacionEntity } from './entities/evaluacion.entity';

@Injectable()
export class EvaluacionService {
  constructor(private prisma: PrismaService) {}

  async getVideojuegosAsignados(juradoId: number) {
    const videojuegos = await this.prisma.videojuego.findMany({
      where: {
        deleted: false,
        asignaciones: {
          some: {
            id_jurado: juradoId,
            deleted: false,
          },
        },
      },
      include: {
        equipo: {
          include: {
            estudiantes: {
              include: {
                usuario: true,
                estudianteNrcs: {
                  include: {
                    nrc: {
                      include: {
                        materia: true,
                        profesor: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        evaluaciones: {
          where: {
            jurado_id: juradoId,
            deleted: false,
          },
        },
      },
    });

    return videojuegos
      .filter((v) => !v.equipo?.deleted)
      .map((v) => {
        const estudianteNrcs = v.equipo.estudiantes
          .flatMap((est) => est.estudianteNrcs)
          .filter(
            (n) => !n.deleted && !n.nrc.deleted && !n.nrc.materia.deleted,
          );

        const nrcsUnicos = [
          ...new Set(estudianteNrcs.map((n) => n.nrc.codigo_nrc)),
        ];
        const materiasUnicas = [
          ...new Set(estudianteNrcs.map((n) => n.nrc.materia.nombre)),
        ];
        const profesoresUnicos = [
          ...new Set(
            estudianteNrcs
              .map((n) => n.nrc.profesor?.nombre_completo)
              .filter(Boolean),
          ),
        ];

        const integrantes = v.equipo.estudiantes
          .filter((e) => !e.deleted && e.usuario)
          .map((e) => e.usuario.nombre_completo);

        const yaEvaluado = v.evaluaciones.length > 0;

        return {
          id: v.id,
          nombre_videojuego: v.nombre_videojuego,
          descripcion: v.descripcion,
          equipo: {
            nombre: v.equipo.nombre_equipo,
            logo: v.equipo.url_logo,
          },
          integrantes,
          nrcs: nrcsUnicos.length ? nrcsUnicos : ['NRC no asignado'],
          materias: materiasUnicas.length
            ? materiasUnicas
            : ['Materia no asignada'],
          profesores: profesoresUnicos.length
            ? profesoresUnicos
            : ['Profesor no asignado'],
          estado: yaEvaluado,
        };
      });
  }

  async getEvaluacionesHechas(juradoId: number) {
    const evaluaciones = await this.prisma.evaluacion.findMany({
      where: {
        jurado_id: juradoId,
        deleted: false,
      },
      include: {
        videojuego: {
          include: {
            equipo: true,
          },
        },
        rubricas: {
          where: { deleted: false },
          include: {
            criterio: true,
          },
        },
      },
    });

    return plainToInstance(
      EvaluacionEntity,
      evaluaciones
        .filter((e) => !e.videojuego?.deleted)
        .map((e) => ({
          ...e,
          videojuego: {
            ...e.videojuego,
            equipo: e.videojuego.equipo?.deleted ? null : e.videojuego.equipo,
          },
        })),
      { excludeExtraneousValues: true },
    );
  }

  async getEvaluacionPorId(id: number) {
    const evaluacion = await this.prisma.evaluacion.findUnique({
      where: { id },
      include: {
        videojuego: {
          include: {
            equipo: true,
          },
        },
        rubricas: {
          where: { deleted: false },
          include: {
            criterio: true,
          },
        },
      },
    });

    if (!evaluacion || evaluacion.deleted || evaluacion.videojuego.deleted) {
      throw new NotFoundException('Evaluación no encontrada');
    }

    return plainToInstance(
      EvaluacionEntity,
      {
        ...evaluacion,
        videojuego: {
          ...evaluacion.videojuego,
          equipo: evaluacion.videojuego.equipo?.deleted
            ? null
            : evaluacion.videojuego.equipo,
        },
      },
      { excludeExtraneousValues: true },
    );
  }

  async getEvaluacionesPorVideojuego(videojuegoId: number, juradoId: number) {
    const videojuego = await this.prisma.videojuego.findUnique({
      where: { id: videojuegoId },
      select: {
        nombre_videojuego: true,
        deleted: true,
      },
    });

    if (!videojuego || videojuego.deleted) {
      throw new NotFoundException('Videojuego no encontrado');
    }

    const evaluaciones = await this.prisma.evaluacion.findMany({
      where: {
        videojuego_id: videojuegoId,
        jurado_id: juradoId,
        deleted: false,
      },
      include: {
        rubricas: {
          where: { deleted: false },
          select: {
            id_criterio: true,
            valoracion: true,
            /*criterio: {
              // <- Agrega esto
              select: { nombre: true },
            },*/
          },
        },
      },
    });

    if (evaluaciones.length === 0) {
      throw new NotFoundException('No hay evaluaciones para este videojuego');
    }

    return {
      videojuego: videojuego.nombre_videojuego,
      evaluaciones: evaluaciones.map((e) => ({
        comentarios: e.comentarios,
        rubricas: e.rubricas,
      })),
    };
  }

  async getVideojuegoPorId(videojuegoId: number) {
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        id: videojuegoId,
        deleted: false,
      },
      include: {
        equipo: {
          include: {
            estudiantes: {
              include: {
                usuario: true,
                estudianteNrcs: {
                  include: {
                    nrc: {
                      include: {
                        materia: true,
                        profesor: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        evaluaciones: {
          where: {
            deleted: false,
          },
        },
      },
    });

    if (!videojuego || videojuego.equipo?.deleted) return null;

    const estudianteNrcs = videojuego.equipo.estudiantes
      .flatMap((est) => est.estudianteNrcs)
      .filter((n) => !n.deleted && !n.nrc.deleted && !n.nrc.materia.deleted);

    const nrcsUnicos = [
      ...new Set(estudianteNrcs.map((n) => n.nrc.codigo_nrc)),
    ];
    const materiasUnicas = [
      ...new Set(estudianteNrcs.map((n) => n.nrc.materia.nombre)),
    ];
    const profesoresUnicos = [
      ...new Set(
        estudianteNrcs
          .map((n) => n.nrc.profesor?.nombre_completo)
          .filter(Boolean),
      ),
    ];

    const integrantes = videojuego.equipo.estudiantes
      .filter((e) => !e.deleted && e.usuario)
      .map((e) => e.usuario.nombre_completo);

    const yaEvaluado = videojuego.evaluaciones.length > 0;

    return {
      id: videojuego.id,
      nombre_videojuego: videojuego.nombre_videojuego,
      descripcion: videojuego.descripcion,
      equipo: {
        nombre: videojuego.equipo.nombre_equipo,
        logo: videojuego.equipo.url_logo,
      },
      integrantes,
      nrcs: nrcsUnicos.length ? nrcsUnicos : ['NRC no asignado'],
      materias: materiasUnicas.length
        ? materiasUnicas
        : ['Materia no asignada'],
      profesores: profesoresUnicos.length
        ? profesoresUnicos
        : ['Profesor no asignado'],
      estado: yaEvaluado,
    };
  }

  async crearEvaluacion(
    juradoId: number,
    videojuegoId: number,
    dto: CreateEvaluacionDto,
  ) {
    const yaAsignado = await this.prisma.videojuegoAsignado.findUnique({
      where: {
        id_videojuego_id_jurado: {
          id_videojuego: videojuegoId,
          id_jurado: juradoId,
        },
      },
    });

    if (!yaAsignado || yaAsignado.deleted) {
      throw new BadRequestException(
        'No tienes permiso para evaluar este videojuego.',
      );
    }

    const yaEvaluado = await this.prisma.evaluacion.findUnique({
      where: {
        jurado_id_videojuego_id: {
          jurado_id: juradoId,
          videojuego_id: videojuegoId,
        },
      },
    });

    if (yaEvaluado && !yaEvaluado.deleted) {
      throw new BadRequestException('Ya has evaluado este videojuego.');
    }

    if (!dto.rubricas || dto.rubricas.length !== 6) {
      throw new BadRequestException(
        'Debe calificar exactamente los 6 criterios.',
      );
    }

    await this.prisma.evaluacion.create({
      data: {
        jurado_id: juradoId,
        videojuego_id: videojuegoId,
        comentarios: dto.comentarios,
        deleted: false,
        rubricas: {
          createMany: {
            data: dto.rubricas.map((r) => ({
              id_criterio: r.id_criterio,
              valoracion: r.valoracion,
              deleted: false,
            })),
          },
        },
      },
    });

    const evaluacion = await this.prisma.evaluacion.findUnique({
      where: {
        jurado_id_videojuego_id: {
          jurado_id: juradoId,
          videojuego_id: videojuegoId,
        },
      },
      include: {
        videojuego: {
          include: {
            equipo: true,
          },
        },
        rubricas: {
          where: { deleted: false },
          include: {
            criterio: true,
          },
        },
      },
    });

    if (!evaluacion) {
      throw new NotFoundException(
        'Evaluación no encontrada después de crearla',
      );
    }

    return plainToInstance(
      EvaluacionEntity,
      {
        ...evaluacion,
        videojuego: {
          ...evaluacion.videojuego,
          equipo: evaluacion.videojuego.equipo?.deleted
            ? null
            : evaluacion.videojuego.equipo,
        },
      },
      { excludeExtraneousValues: true },
    );
  }
}
