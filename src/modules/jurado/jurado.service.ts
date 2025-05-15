import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { ConfirmarJuradoDto } from './dto/confirmar-Jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';
import { DetalleCriterioEvaluadoDto } from './dto/detalle-evaluacion-criterio.dto';
import { EvaluacionRealizadaDto } from './dto/evaluacion-realizada.dto';
import { AsignarVideojuegoDto } from './dto/asignar-videojuego.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../common/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EstadoJurado, Prisma } from '@prisma/client';

@Injectable()
export class JuradoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createJuradoDto: CreateJuradoDto) {
    const { email, nombre_completo } = createJuradoDto;

    const existingUser = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        `El correo electrónico "${email}" ya está registrado.`,
      );
    }

    // Solución Error 1: Inicializar como string vacío
    let confirmationToken: string = '';

    try {
      const tempPassword = email + crypto.randomBytes(4).toString('hex');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);
      // Asignar el valor (sin const)
      confirmationToken = crypto.randomBytes(32).toString('hex');

      // Solución Error 2: Devolver explícitamente usuario y jurado
      const { usuario, jurado } = await this.prisma.$transaction(async (tx) => {
        const createdUsuario = await tx.usuario.create({
          data: {
            nombre_completo,
            email,
            hash_contrasena: hashedPassword,
          },
        });

        // Quitar el 'include' aquí, lo manejaremos después
        const createdJurado = await tx.jurado.create({
          data: {
            id_user: createdUsuario.id,
            estado: EstadoJurado.no_confirmado, // Usar el ENUM importado si es necesario
            token_confirmacion: confirmationToken,
            ultima_conexion: new Date(),
          },
        });
        // Devolver ambos objetos creados
        return { usuario: createdUsuario, jurado: createdJurado };
      });

      // Usar directamente el objeto 'usuario' devuelto por la transacción
      if (confirmationToken && usuario) {
        await this.mailService.sendJuradoInvitation(
          usuario.email,
          usuario.nombre_completo,
          confirmationToken,
        );
      }

      // Construir manualmente el objeto de respuesta deseado
      // para devolver el Jurado con su Usuario asociado (datos seleccionados)
      const responseJurado = {
          ...jurado, // Campos del jurado creado
          usuario: { // Añadir objeto usuario anidado
              id: usuario.id,
              nombre_completo: usuario.nombre_completo,
              email: usuario.email,
              create_at: usuario.create_at,
              update_at: usuario.update_at
          }
      };

      return responseJurado;

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error al crear jurado:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al crear el jurado.',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.jurado.findMany({
        where: { deleted: false },
        include: {
          usuario: {
            select: {
              id: true,
              nombre_completo: true,
              email: true,
            },
          },
        },
        orderBy: {
           id: 'asc'
        }
      });
    } catch (error) {
      console.error('Error al buscar todos los jurados:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al buscar los jurados.',
      );
    }
  }

  async findOne(id: number) {
    try {
      const jurado = await this.prisma.jurado.findUnique({
        where: { id: id, deleted: false },
        include: {
          usuario: {
            select: {
              id: true,
              nombre_completo: true,
              email: true,
            },
          },
        },
      });

      if (!jurado) {
        throw new NotFoundException(`Jurado con ID "${id}" no encontrado o eliminado.`);
      }
      return jurado;
    } catch (error) {
       if (error instanceof NotFoundException) {
         throw error;
       }
       console.error(`Error al buscar jurado con ID ${id}:`, error);
       throw new InternalServerErrorException(
         `Ocurrió un error inesperado al buscar el jurado.`,
       );
    }
  }

  async update(id: number, updateJuradoDto: UpdateJuradoDto) {
    const { nombre_completo, email } = updateJuradoDto;

    const juradoActual = await this.prisma.jurado.findUnique({
       where: { id: id, deleted: false },
       include: { usuario: true }
    });

    if (!juradoActual) {
       throw new NotFoundException(`Jurado con ID "${id}" no encontrado o eliminado.`);
    }

    if (email && email !== juradoActual.usuario.email) {
       const existingUserWithEmail = await this.prisma.usuario.findUnique({
          where: { email },
       });
       if (existingUserWithEmail && existingUserWithEmail.id !== juradoActual.id_user) {
          throw new ConflictException(`El correo electrónico "${email}" ya está registrado por otro usuario.`);
       }
    }

    try {
       const juradoActualizado = await this.prisma.$transaction(async (tx) => {
          if (nombre_completo || email) {
             await tx.usuario.update({
                where: { id: juradoActual.id_user },
                data: {
                   ...(nombre_completo && { nombre_completo }),
                   ...(email && { email }),
                   update_at: new Date(),
                },
             });
          }

          return await tx.jurado.findUniqueOrThrow({
             where: { id: id },
             include: {
                usuario: {
                   select: {
                      id: true,
                      nombre_completo: true,
                      email: true,
                      create_at: true,
                      update_at: true,
                   },
                },
             },
          });
       });

       return juradoActualizado;

    } catch (error) {
       if (error instanceof ConflictException || error instanceof NotFoundException) {
          throw error;
       }
       console.error(`Error al actualizar jurado con ID ${id}:`, error);
       throw new InternalServerErrorException(
         `Ocurrió un error inesperado al actualizar el jurado.`,
       );
    }
  }

  async remove(id: number) {
    const juradoActual = await this.prisma.jurado.findUnique({
       where: { id: id, deleted: false },
       include: { usuario: true }
    });

    if (!juradoActual) {
       throw new NotFoundException(`Jurado con ID "${id}" no encontrado o ya eliminado.`);
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.jurado.update({
          where: { id: id },
          data: { deleted: true, update_at: new Date() },
        });
        await tx.usuario.update({
          where: { id: juradoActual.id_user },
          data: { deleted: true, update_at: new Date() },
        });
      });
      return;

    } catch (error) {
      if (error instanceof NotFoundException) {
         throw error;
      }
      console.error(`Error al eliminar jurado con ID ${id}:`, error);
      throw new InternalServerErrorException(
         `Ocurrió un error inesperado al eliminar el jurado.`,
      );
    }
  }

  async confirmarInvitacionYEstablecerContrasena(confirmarJuradoDto: ConfirmarJuradoDto) {
    const { token, nueva_contrasena } = confirmarJuradoDto;
  
    // 1. Buscar al jurado por el token de confirmación
    const jurado = await this.prisma.jurado.findFirst({ // Usar findFirst para poder incluir usuario después si es necesario
      where: {
        token_confirmacion: token,
        estado: EstadoJurado.no_confirmado, // Solo procesar si no ha sido confirmado antes
        deleted: false,
      },
    });
  
    if (!jurado) {
      throw new NotFoundException(
        'Token inválido, expirado o el jurado ya ha sido confirmado.',
      );
    }
  
    // 2. Hashear la nueva contraseña
    const saltRounds = 10; // El mismo que usaste al crear la contraseña temporal
    const hashedNuevaContrasena = await bcrypt.hash(nueva_contrasena, saltRounds);
  
    try {
      // 3. Actualizar el usuario y el jurado en una transacción
      const usuarioActualizado = await this.prisma.$transaction(async (tx) => {
        // Actualizar la contraseña en la tabla Usuario
        const updatedUser = await tx.usuario.update({
          where: { id: jurado.id_user },
          data: {
            hash_contrasena: hashedNuevaContrasena,
            update_at: new Date(),
          },
        });
  
        // Actualizar el estado del jurado y limpiar el token
        await tx.jurado.update({
          where: { id: jurado.id },
          data: {
            estado: EstadoJurado.confirmado,
            ultima_conexion: new Date(), // Actualizar última conexión o momento de confirmación
            update_at: new Date(),
          },
        });
        return updatedUser; // Devolver el usuario actualizado
      });
  
      // Podrías devolver un mensaje de éxito o el usuario/jurado actualizado sin la contraseña.
      return {
        message: 'Cuenta de jurado confirmada y contraseña establecida exitosamente.',
        // email: usuarioActualizado.email // Si quieres devolver algún dato
      };
  
    } catch (error) {
      console.error('Error al confirmar jurado y establecer contraseña:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al procesar la confirmación.',
      );
    }
  }

  async findEvaluacionesRealizadas(juradoId: string): Promise<EvaluacionRealizadaDto[]> {
    const juradoConEvaluaciones = await this.prisma.jurado.findUnique({
      where: { id: Number(juradoId) },
      select: {
        id: true,
        evaluaciones: {
          select: {
            videojuego_id: true,
            comentarios: true,
            videojuego: {
              select: {
                nombre_videojuego: true,
                equipo: {
                  select: {
                    estudiantes: {
                      select: {
                        estudianteNrcs: {
                          select: {
                            id_nrc: true,
                          },
                        },
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
    if (!juradoConEvaluaciones) {
      throw new NotFoundException(`Jurado con ID "${juradoId}" no encontrado.`);
    }
    if (!juradoConEvaluaciones.evaluaciones || juradoConEvaluaciones.evaluaciones.length === 0) {
      return [];
    }
    const resultado: EvaluacionRealizadaDto[] = juradoConEvaluaciones.evaluaciones.map(evaluacion => {
      const codigosNrcUnicos = new Set<number>();
      if (evaluacion.videojuego?.equipo?.estudiantes) {
        for (const estudiante of evaluacion.videojuego.equipo.estudiantes) {
          if (estudiante.estudianteNrcs) {
            for (const estudianteNrc of estudiante.estudianteNrcs) {
              codigosNrcUnicos.add(estudianteNrc.id_nrc);
            }
          }
        }
      }
      return {
        videojuegoId: evaluacion.videojuego_id.toString(),
        nombreVideojuego: evaluacion.videojuego.nombre_videojuego,
        comentarios: evaluacion.comentarios,
        codigosNrc: Array.from(codigosNrcUnicos),
      };
    });
    return resultado;
  }

  async findDetalleEvaluacionVideojuego(
    juradoId: number,
    videojuegoId: number,
  ): Promise<DetalleCriterioEvaluadoDto[]> {
    const evaluacion = await this.prisma.evaluacion.findUnique({
      where: {
        jurado_id_videojuego_id: {
          jurado_id: juradoId,
          videojuego_id: videojuegoId,
        },
      },
      include: {
        rubricas: {
          include: {
            criterio: true,
          },
        },
      },
    });
    if (!evaluacion) {
      throw new NotFoundException(
        `No se encontró una evaluación para el jurado con ID "${juradoId}" y el videojuego con ID "${videojuegoId}".`,
      );
    }
    if (!evaluacion.rubricas || evaluacion.rubricas.length === 0) {
      return [];
    }
    return evaluacion.rubricas.map(rubricaItem => ({
      nombreCriterio: rubricaItem.criterio.nombre,
      valoracion: rubricaItem.valoracion,
    }));
  }

  async reenviarInvitacion(id: number) {
    const jurado = await this.prisma.jurado.findUnique({
      where: { id: id, deleted: false },
      include: {
        usuario: {
          select: {
            email: true,
            nombre_completo: true,
          },
        },
      },
    });

    if (!jurado || !jurado.usuario) {
      throw new NotFoundException(
        `Jurado con ID "${id}" no encontrado o no tiene un usuario asociado.`,
      );
    }

    if (jurado.estado === EstadoJurado.confirmado) {
      throw new ConflictException(
        `El jurado "${jurado.usuario.nombre_completo}" ya ha confirmado su invitación.`,
      );
    }

    const nuevoTokenConfirmacion = crypto.randomBytes(32).toString('hex');

    try {
      await this.prisma.jurado.update({
        where: { id: jurado.id },
        data: {
          token_confirmacion: nuevoTokenConfirmacion,
          update_at: new Date(),
        },
      });

      await this.mailService.sendJuradoInvitation(
        jurado.usuario.email,
        jurado.usuario.nombre_completo,
        nuevoTokenConfirmacion,
      );

      return {
        message: `Correo de invitación reenviado exitosamente a ${jurado.usuario.email}.`,
      };

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error(`Error al reenviar invitación para jurado ID ${id}:`, error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al reenviar la invitación.',
      );
    }
  }

  async asignarVideojuego(asignarDto: AsignarVideojuegoDto): Promise<any> {
    const { juradoId, videojuegoId } = asignarDto;

    const jurado = await this.prisma.jurado.findUnique({
      where: { 
        id: juradoId,
        deleted: false
      },
    });
    if (!jurado) {
      throw new NotFoundException(`Jurado con ID "${juradoId}" no encontrado o está eliminado.`);
    }

    const videojuego = await this.prisma.videojuego.findUnique({
      where: { 
        id: videojuegoId,
        deleted: false
      },
    });
    if (!videojuego) {
      throw new NotFoundException(`Videojuego con ID "${videojuegoId}" no encontrado o está eliminado.`);
    }

    try {
      const nuevaAsignacion = await this.prisma.videojuegoAsignado.create({
        data: {
          
          id_jurado: juradoId,
          id_videojuego: videojuegoId,
          
        },
        include: {
          jurado: { 
            select: { 
              id: true, 
              usuario: { select: { nombre_completo: true, email: true } } 
            } 
          },
          videojuego: { 
            select: { 
              id: true, 
              nombre_videojuego: true 
            } 
          }
        }
      });
      
      
      return { 
        message: 'Videojuego asignado al jurado exitosamente.', 
        
      };

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        
        if (error.code === 'P2002') { 
          throw new ConflictException(
            `El jurado con ID "${juradoId}" ya tiene asignado el videojuego con ID "${videojuegoId}".`
          );
        }
      }
      console.error('Error al asignar videojuego a jurado:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al realizar la asignación.'
      );
    }
  }

  async desasignarVideojuego(juradoId: number, videojuegoId: number): Promise<void> {
  const asignacionExistente = await this.prisma.videojuegoAsignado.findUnique({
    where: {
      id_videojuego_id_jurado: { 
        id_jurado: juradoId,
        id_videojuego: videojuegoId,
      },
    },
  }); 

  await this.prisma.videojuegoAsignado.update({
    where: {
      id_videojuego_id_jurado: {
        id_jurado: juradoId,
        id_videojuego: videojuegoId,
      },
    },
    data: {
      deleted: true,
    },
  });
}
}