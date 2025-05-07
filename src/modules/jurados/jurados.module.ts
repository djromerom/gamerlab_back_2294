import { Module } from '@nestjs/common';
import { JuradosService } from './jurados.service';
import { JuradosController } from './jurados.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [JuradosController],
  providers: [JuradosService, PrismaService],
  exports: [JuradosService]
})
export class JuradosModule {}
