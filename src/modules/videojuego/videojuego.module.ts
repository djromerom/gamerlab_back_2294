import { Module } from '@nestjs/common';
import { VideojuegoService } from './videojuego.service';
import { VideojuegoController } from './videojuego.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';

@Module({
  controllers: [VideojuegoController],
  providers: [VideojuegoService, PrismaService, ValidationExitsService],
})
export class VideojuegoModule {}
