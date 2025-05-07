import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { EstadoJurado } from '@prisma/client';

@Injectable()
export class JuradosService {
  constructor(
    private prisma: PrismaService,
    private mailService: EmailService
  ) {}

  async confirmarJurado(token: string) {
    const jurado = await this.prisma.jurado.findFirst({
      where: { token_confirmacion: token, deleted: false }
    });

    if (!jurado) throw new NotFoundException('Token inválido');

    return this.prisma.jurado.update({
      where: { id: jurado.id },
      data: {
        estado: EstadoJurado.confirmado,
        ultima_conexion: new Date()
      }
    });
  }

  async getEvaluaciones(juradoId: number) {
    return this.prisma.evaluacion.findMany({
      where: { 
        jurado_id: juradoId,
        deleted: false 
      },
      include: {
        videojuego: true,
        rubricas: {
          include: { criterio: true }
        }
      }
    });
  }

  async reenviarInvitacion(juradoId: number) {
    const jurado = await this.prisma.jurado.findUnique({
      where: { id: juradoId },
      include: { usuario: true }
    });

    if (!jurado) throw new NotFoundException('Jurado no encontrado');

    await this.mailService.sendJuradoInvitation(
      jurado.usuario.email,
      jurado.token_confirmacion
    );
  }

  async getEstadisticasJurado(juradoId: number) {
    return this.prisma.jurado.findUnique({
      where: { id: juradoId },
      select: {
        estado: true,
        ultima_conexion: true,
        _count: {
          select: { evaluaciones: true }
        }
      }
    });
  }
}

