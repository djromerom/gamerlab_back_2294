import { Module } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { EstudianteModule } from '../estudiante/estudiante.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [EstudianteModule, PrismaModule],
  controllers: [EquipoController],
  providers: [EquipoService, ValidationExitsService],
})
export class EquipoModule {}
