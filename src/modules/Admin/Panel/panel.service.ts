import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Estado } from "@prisma/client";

@Injectable()
export class PanelService {
  constructor(private prisma: PrismaService) {}

  // 🖥️ Contar equipos en estado Inscrito_confirmado
  async getCountEquipos() {
    return await this.prisma.equipo.count({
      where: {
        estado: Estado.Inscrito_confirmado,
        deleted: false,
      },
    });
  }

  // 🎮 Contar videojuegos
  async getCountVideojuegos() {
    return await this.prisma.videojuego.count({
      where: {
        deleted: false,
      },
    });
  }

  // 📊 Contar evaluaciones hechas
  async getCountEvaluacionesHechas() {
    return await this.prisma.evaluacion.count({
      where: {
        deleted: false,
      },
    });
  }

  // 📈 Calcular promedio global de todas las evaluaciones
  async getPromedioGlobal() {
    const videojuegos = await this.prisma.videojuego.findMany({
      where: {
        evaluaciones: {
          some: {
            deleted: false,
          },
        },
        deleted: false,
      },
      include: {
        evaluaciones: {
          where: {
            deleted: false,
          },
          include: {
            rubricas: {
              where: {
                deleted: false,
              },
              include: {
                criterio: true,
              },
            },
          },
        },
      },
    });

    const todasLasNotas: number[] = [];

    videojuegos.forEach((videojuego) => {
      videojuego.evaluaciones.forEach((evaluacion) => {
        let suma = 0;
        evaluacion.rubricas.forEach((rubrica) => {
          const valoracion = rubrica.valoracion;
          // Si quieres aplicar un peso, puedes agregar un campo porcentaje en el criterio y multiplicarlo
          suma += valoracion;
        });

        if (evaluacion.rubricas.length > 0) {
          const promedio = suma / evaluacion.rubricas.length;
          todasLasNotas.push(promedio);
        }
      });
    });

    if (todasLasNotas.length === 0) {
      return { promedioGeneral: 0 };
    }

    const promedioGeneral =
      todasLasNotas.reduce((a, b) => a + b, 0) / todasLasNotas.length;

    return {
      promedioGeneral: parseFloat(promedioGeneral.toFixed(2)),
    };
  }

  // ❌ Videojuegos sin evaluar
  async getSinCalificar() {
    return await this.prisma.videojuego.findMany({
      where: {
        evaluaciones: {
          none: {
            deleted: false,
          },
        },
        deleted: false,
      },
    });
  }

  // 💤 Jurados inactivos (sin evaluaciones)
  async getJuradosInactivos() {
    return await this.prisma.jurado.findMany({
      where: {
        evaluaciones: {
          none: {
            deleted: false,
          },
        },
        deleted: false,
      },
      include: {
        usuario: true,
      },
    });
  }

  // 📝 Equipos con registro incompleto (estado: Pendiente_confirmacion)
  async getEquiposRegistroIncompleto() {
    return await this.prisma.equipo.findMany({
      where: {
        estado: Estado.Pendiente_confirmacion,
        deleted: false,
      },
    });
  }
}

