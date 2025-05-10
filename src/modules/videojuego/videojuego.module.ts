import { Module } from '@nestjs/common';
import { VideojuegoService } from './videojuego.service';
import { VideojuegoController } from './videojuego.controller';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideojuegoController],
  providers: [VideojuegoService, ValidationExitsService],
})
export class VideojuegoModule {}
