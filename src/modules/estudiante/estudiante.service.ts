import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { EstudianteEntity } from './entities/estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(private readonly prisma: PrismaService, private readonly exits: ValidationExitsService) {}

  async create(id_equipo: number, createEstudianteDto: CreateEstudianteDto) {
    // Verificar si el equipo existe en la base de datos
    const existingEquipo = await this.prisma.equipo.findUnique({
      where: {
        id: id_equipo,
        deleted: false,
      },
    });

    this.exits.validateExists('equipo', existingEquipo);

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

    const estudiante = await this.prisma.estudiante.create({
      data: {
        equipo_id: id_equipo,
        id_user: usuario.id,
        github: createEstudianteDto.github,
      },
    });

    return estudiante;
  }

  async createMany(id_equipo: number, createEstudianteDto: CreateEstudianteDto[]) {
    const estudiantes: EstudianteEntity[] = [];
    
    createEstudianteDto.forEach(async (estudiante) => {
      const newEstudiante = await this.create(id_equipo, estudiante);
      estudiantes.push(newEstudiante);
    });
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
}
