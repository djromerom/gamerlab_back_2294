import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { EmailModule } from 'src/modules/email/email.module';
import { GenerateTokenService } from 'src/common/services/generateToken.service';

@Module({
  imports: [EmailModule],
  providers: [EstudianteService, PrismaService, ValidationExitsService, GenerateTokenService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
