import { Module } from '@nestjs/common';
import { MateriasService } from './materia.service';
import { MateriasController } from './materia.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MateriasController],
  providers: [MateriasService],
})
export class MateriaModule {}