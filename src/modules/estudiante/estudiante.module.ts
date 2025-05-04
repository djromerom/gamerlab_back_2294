import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';

@Module({
  providers: [EstudianteService, PrismaService, ValidationExitsService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
