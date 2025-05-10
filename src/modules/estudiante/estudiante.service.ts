import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { EstudianteEntity } from './entities/estudiante.entity';
import { EmailService } from 'src/modules/email/email.service';
import { GenerateTokenService } from 'src/common/services/generateToken.service';

@Injectable()
export class EstudianteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exits: ValidationExitsService,
    private readonly emailService: EmailService,
    private readonly generateTokenService: GenerateTokenService
  ) { }

  async create(id_equipo: number, createEstudianteDto: CreateEstudianteDto) {

    // Verificar si el estudiante ya existe en la base de datos
    let usuario = await this.prisma.usuario.findUnique({
      where: {
        email: createEstudianteDto.email,
      },
    });

    if (!usuario) {
      usuario = await this.prisma.usuario.create({
        data: {
          nombre_completo: createEstudianteDto.nombre_completo,
          email: createEstudianteDto.email,
          hash_contrasena: '1234567',
        },
      });
    }

    const existingEstudiante = await this.prisma.estudiante.findFirst({
      where: {
        id_user: usuario.id,
        deleted: false,
      },
    });

    // Verificar si el estudiante ya existe en otro equipo
    if (existingEstudiante) {
      if (existingEstudiante.equipo_id !== id_equipo) {
        // Si el estudiante ya existe en otro equipo, no se puede agregar a este equipo
        throw new HttpException('El estudiante ya existe en otro equipo', HttpStatus.BAD_REQUEST);
      }
      // Si el estudiante ya existe en el mismo equipo, no se puede agregar nuevamente
      throw new HttpException('El estudiante ya existe', HttpStatus.BAD_REQUEST);
    }

    // Generar token para la confirmación por correo
    const confirmationToken = this.generateTokenService.generateToken();

    // Guardar el token en algún lugar (podríamos añadir una tabla de tokens o usar Redis)
    // Por ahora, lo guardaremos en el mismo estudiante
    const estudiante = await this.prisma.estudiante.create({
      data: {
        equipo_id: id_equipo,
        id_user: usuario.id,
        github: createEstudianteDto.github,
        token_confirmacion: confirmationToken, // Añadir esta columna en la próxima migración
      },
    });

    return estudiante;
  }

  async createMany(id_equipo: number, createEstudianteDto: CreateEstudianteDto[]) {
    // Verificar si el equipo existe en la base de datos
    const existingEquipo = await this.prisma.equipo.findUnique({
      where: {
        id: id_equipo,
        deleted: false,
      },
    });
    this.exits.validateExists('equipo', existingEquipo);

    // Usar Promise.all para esperar a que todos los estudiantes se creen
    const estudiantes = await Promise.all(
      createEstudianteDto.map(estudiante => this.create(id_equipo, estudiante))
    );

    // enviar correo de confirmación a todos los estudiantes
    await this.emailService.sendConfirmationEmail(
      {
        emails: createEstudianteDto.map(e => e.email),
        teamName: existingEquipo?.nombre_equipo as string,
        token: estudiantes.map(e => e.token_confirmacion as string),
      }
    );

    return estudiantes;
  }

  findAll() {
    return this.prisma.estudiante.findMany({
      where: {
        deleted: false,
      },
    });
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    this.exits.validateExists('estudiante', estudiante);

    return estudiante;
  }

  async update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    this.exits.validateExists('estudiante', estudiante);

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: estudiante?.id_user,
      },
    });

    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.prisma.estudiante.update({
      where: { id },
      data: {
        github: updateEstudianteDto.github,
        usuario: {
          update: {
            nombre_completo: updateEstudianteDto.nombre_completo,
            email: updateEstudianteDto.email,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    this.exits.validateExists('estudiante', estudiante);

    return this.prisma.estudiante.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }

  async confirmarEstudiante(token: string): Promise<Partial<EstudianteEntity>> {
    // Buscar estudiante por token
    const estudiante = await this.prisma.estudiante.findFirst({
      where: {
        token_confirmacion: token, // Asumiendo que tenemos esta columna
        deleted: false,
      },
    });

    if (!estudiante) {
    throw new HttpException('Token de confirmación no válido', HttpStatus.NOT_FOUND);
  }

  if (estudiante.confirmado) {
    throw new HttpException('El estudiante ya está confirmado', HttpStatus.BAD_REQUEST);
  }
    

    // Actualizar estado de confirmación
    const estudianteActualizado = await this.prisma.estudiante.update({
      where: {
        id: estudiante.id,
      },
      data: {
        confirmado: true,
        //token_confirmacion: null, // Borramos el token una vez usado
      },
      select: {
        id: true,
        confirmado: true,
        github: true,
        equipo_id: true,
        usuario: {
          select: {
            nombre_completo: true,
            email: true,
          },
        },
        equipo: {
          select: {
            id: true,
            nombre_equipo: true,
          },
        },
      },
    });

    return estudianteActualizado;
  }
  // Añadir este método a EstudianteService

async invalidarToken(token: string) {
  const estudiante = await this.prisma.estudiante.findFirst({
    where: {
      token_confirmacion: token,
      deleted: false,
    },
  });

  if (!estudiante) {
    throw new HttpException('Estudiante no encontrado', HttpStatus.NOT_FOUND);
  }

  await this.prisma.estudiante.update({
    where: {
      id: estudiante.id,
    },
    data: {
      token_confirmacion: null, // Borramos el token una vez usado
    },
  });

  return { message: 'Token invalidado exitosamente' };
}


}
