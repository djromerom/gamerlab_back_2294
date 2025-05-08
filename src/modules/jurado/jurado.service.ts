import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { EstadoJurado } from '@prisma/client';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service'; 
@Injectable()
export class JuradoService {
    constructor(
        private prisma: PrismaService, 
        private validationExits: ValidationExitsService,
        private emailService: EmailService  // Añadir esta línea
      ) {}
      
      /**
       * Envía un email de invitación a un jurado
       */
      async enviarInvitacion(id: number) {
        const jurado = await this.findOne(id);
        
        if (!jurado || !jurado.usuario) {
          throw new HttpException('Jurado no encontrado', HttpStatus.NOT_FOUND);
        }
        
        const baseUrl = process.env.APP_URL || 'http://localhost:3000';
        const confirmationUrl = `${baseUrl}/jurado/confirmar/${jurado.token_confirmacion}`;
        
        // Formato adecuado para el EmailService
        return this.emailService.sendConfirmationEmail({
          emails: [jurado.usuario.email],
          token: jurado.token_confirmacion,
          teamName: `Jurado: ${jurado.usuario.nombre_completo}`
        });
      }
  /**
   * Genera un token aleatorio para confirmación
   */
  generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Crea un nuevo jurado
   */
  async create(createJuradoDto: CreateJuradoDto) {
    // Verificar si el usuario existe
    const usuario = await this.prisma.usuario.findFirst({
      where: { 
        id: createJuradoDto.id_user,
        deleted: false
      }
    });

    this.validationExits.validateExists('usuario', usuario);

    // Verificar si ya existe como jurado
    const juradoExistente = await this.prisma.jurado.findFirst({
      where: {
        id_user: createJuradoDto.id_user,
        deleted: false
      }
    });

    if (juradoExistente) {
      throw new HttpException('Este usuario ya está registrado como jurado', HttpStatus.BAD_REQUEST);
    }

    // Si no hay token de confirmación, generamos uno
    if (!createJuradoDto.token_confirmacion) {
      createJuradoDto.token_confirmacion = this.generateToken();
    }

    return this.prisma.jurado.create({
      data: {
        ...createJuradoDto,
        ultima_conexion: new Date()
      },
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Obtiene todos los jurados
   */
  findAll() {
    return this.prisma.jurado.findMany({
      where: {
        deleted: false
      },
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            email: true
          }
        },
        evaluaciones: {
          where: {
            deleted: false
          },
          select: {
            id: true
          }
        }
      }
    });
  }

  /**
   * Obtiene un jurado por su ID
   */
  async findOne(id: number) {
    const jurado = await this.prisma.jurado.findFirst({
      where: {
        id,
        deleted: false
      },
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            email: true
          }
        },
        evaluaciones: {
          where: {
            deleted: false
          },
          include: {
            videojuego: true
          }
        },
        asignaciones: {
          where: {
            deleted: false
          },
          include: {
            videojuego: true
          }
        }
      }
    });

    this.validationExits.validateExists('jurado', jurado);
    return jurado;
  }

  /**
   * Actualiza un jurado existente
   */
  async update(id: number, updateJuradoDto: UpdateJuradoDto) {
    const jurado = await this.prisma.jurado.findFirst({
      where: {
        id,
        deleted: false
      }
    });

    this.validationExits.validateExists('jurado', jurado);

    return this.prisma.jurado.update({
      where: { id },
      data: updateJuradoDto,
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Confirma un jurado mediante su token
   */
  async confirmarJurado(token: string) {
    const jurado = await this.prisma.jurado.findFirst({
      where: {
        token_confirmacion: token,
        deleted: false
      }
    });

    if (!jurado) {
      throw new HttpException('Token de confirmación inválido', HttpStatus.NOT_FOUND);
    }

    return this.prisma.jurado.update({
      where: { id: jurado.id },
      data: {
        estado: EstadoJurado.confirmado,
        ultima_conexion: new Date()
      },
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Realiza un soft delete de un jurado
   */
  async remove(id: number) {
    const jurado = await this.prisma.jurado.findFirst({
      where: {
        id,
        deleted: false
      }
    });

    this.validationExits.validateExists('jurado', jurado);

    return this.prisma.jurado.update({
      where: { id },
      data: {
        deleted: true
      }
    });
  }

  /**
   * Reasigna un token a un jurado y actualiza su estado
   */
  async reenviarInvitacion(id: number) {
    const jurado = await this.prisma.jurado.findFirst({
      where: {
        id,
        deleted: false
      },
      include: {
        usuario: true
      }
    });

    this.validationExits.validateExists('jurado', jurado);

    const newToken = this.generateToken();

    return this.prisma.jurado.update({
      where: { id },
      data: {
        token_confirmacion: newToken,
        estado: EstadoJurado.no_confirmado
      },
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            email: true
          }
        }
      }
    });
  }
  
  /**
   * Asigna un videojuego a un jurado
   */
  async asignarVideojuego(id: number, videojuegoId: number) {
    // Verificar que el jurado existe
    const jurado = await this.prisma.jurado.findFirst({
      where: {
        id,
        deleted: false
      }
    });
    this.validationExits.validateExists('jurado', jurado);

    // Verificar que el videojuego existe
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        id: videojuegoId,
        deleted: false
      }
    });
    this.validationExits.validateExists('videojuego', videojuego);

    // Verificar si ya está asignado
    const asignacionExistente = await this.prisma.videojuegoAsignado.findFirst({
      where: {
        id_jurado: id,
        id_videojuego: videojuegoId,
        deleted: false
      }
    });

    if (asignacionExistente) {
      throw new HttpException('El videojuego ya está asignado a este jurado', HttpStatus.BAD_REQUEST);
    }

    // Crear la asignación
    await this.prisma.videojuegoAsignado.create({
      data: {
        id_jurado: id,
        id_videojuego: videojuegoId
      }
    });

    return this.findOne(id);
  }

  /**
   * Elimina la asignación de un videojuego a un jurado
   */
  async eliminarAsignacion(id: number, videojuegoId: number) {
    // Verificar que el jurado existe
    const jurado = await this.prisma.jurado.findFirst({
      where: {
        id,
        deleted: false
      }
    });
    this.validationExits.validateExists('jurado', jurado);

    // Verificar que el videojuego existe
    const videojuego = await this.prisma.videojuego.findFirst({
      where: {
        id: videojuegoId,
        deleted: false
      }
    });
    this.validationExits.validateExists('videojuego', videojuego);

    // Verificar si está asignado
    const asignacion = await this.prisma.videojuegoAsignado.findFirst({
      where: {
        id_jurado: id,
        id_videojuego: videojuegoId,
        deleted: false
      }
    });

    if (!asignacion) {
      throw new HttpException('El videojuego no está asignado a este jurado', HttpStatus.NOT_FOUND);
    }

    // Eliminar la asignación (soft delete)
    await this.prisma.videojuegoAsignado.update({
      where: {
        id_videojuego_id_jurado: {
          id_jurado: id,
          id_videojuego: videojuegoId
        }
      },
      data: {
        deleted: true
      }
    });

    return this.findOne(id);
  }
}