import { Module } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EvaluacionController],
  providers: [EvaluacionService, PrismaService],
})
export class EvaluacionModule {}
