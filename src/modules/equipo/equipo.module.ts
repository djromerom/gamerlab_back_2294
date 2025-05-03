import { Module } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { EstudianteModule } from '../estudiante/estudiante.module';

@Module({
  imports: [EstudianteModule],
  controllers: [EquipoController],
  providers: [EquipoService, PrismaService, ValidationExitsService],
})
export class EquipoModule {}
