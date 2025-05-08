import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';

@Injectable()
export class EvaluacionService {
  constructor(private prisma: PrismaService) {}

  // Obtener evaluaciones asignadas por calificar de un jurado
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
        evaluaciones: {
          none: {
            jurado_id: juradoId,
            deleted: false,
          },
        },
      },
      include: {
        equipo: {
          include: {
            estudiantes: {
              include: {
                estudianteNrcs: {
                  include: {
                    nrc: {
                      include: {
                        materia: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  
    return videojuegos
      .filter(v => !v.equipo?.deleted)
      .map(v => {
        const estudianteNrcs = v.equipo.estudiantes
          .flatMap(est => est.estudianteNrcs)
          .filter(n => !n.deleted && !n.nrc.deleted && !n.nrc.materia.deleted);
  
        // Extraer NRCs 
        const nrcsUnicos = [
          ...new Set(estudianteNrcs.map(n => n.nrc.codigo_nrc)),
        ];
  
        // Extraer Materias 
        const materiasUnicas = [
          ...new Set(estudianteNrcs.map(n => n.nrc.materia.nombre)),
        ];
  
        return {
          id: v.id,
          nombre_videojuego: v.nombre_videojuego,
          descripcion: v.descripcion,
          equipo: {
            nombre: v.equipo.nombre_equipo,
            logo: v.equipo.url_logo,
          },
          nrcs: nrcsUnicos.length > 0 ? nrcsUnicos : ['NRC no asignado'],
          materias: materiasUnicas.length > 0 ? materiasUnicas : ['Materia no asignada'],
        };
      });
  }  
  

  // Obtener evaluaciones realizadas por un jurado
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

    return evaluaciones
      .filter(e => !e.videojuego?.deleted)
      .map(e => ({
        ...e,
        videojuego: {
          ...e.videojuego,
          equipo: e.videojuego.equipo?.deleted ? null : e.videojuego.equipo,
        },
      }));
  }

  // Obtener una evaluación por ID
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

    return {
      ...evaluacion,
      videojuego: {
        ...evaluacion.videojuego,
        equipo: evaluacion.videojuego.equipo?.deleted ? null : evaluacion.videojuego.equipo,
      },
    };
  }

  // Obtener todas las evaluaciones de un videojuego
  async getEvaluacionesPorVideojuego(videojuegoId: number) {
    const evaluaciones = await this.prisma.evaluacion.findMany({
      where: {
        videojuego_id: videojuegoId,
        deleted: false,
      },
      include: {
        jurado: {
          include: {
            usuario: {
              select: {
                nombre_completo: true,
                email: true,
              },
            },
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

    if (evaluaciones.length === 0) {
      throw new NotFoundException('No hay evaluaciones para este videojuego');
    }

    return evaluaciones;
  }

  // Crear evaluación con validaciones
  async crearEvaluacion(juradoId: number, videojuegoId: number, dto: CreateEvaluacionDto) {
    const yaAsignado = await this.prisma.videojuegoAsignado.findUnique({
      where: {
        id_videojuego_id_jurado: {
          id_videojuego: videojuegoId,
          id_jurado: juradoId,
        },
      },
    });

    if (!yaAsignado || yaAsignado.deleted) {
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

    if (yaEvaluado && !yaEvaluado.deleted) {
      throw new BadRequestException('Ya has evaluado este videojuego.');
    }

    if (!dto.rubricas || dto.rubricas.length !== 6) {
      throw new BadRequestException('Debe calificar exactamente los 6 criterios.');
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

    // Retornar evaluación creada con relaciones
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
      throw new NotFoundException('Evaluación no encontrada después de crearla');
    }
    
    return {
      ...evaluacion,
      videojuego: {
        ...evaluacion.videojuego,
        equipo: evaluacion.videojuego.equipo?.deleted ? null : evaluacion.videojuego.equipo,
      },
    };
  }
}



