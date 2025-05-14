import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationExitsService } from 'src/common/services/validation-exits.service';
import { EmailModule } from 'src/modules/email/email.module';
import { GenerateTokenService } from 'src/common/services/generateToken.service';
import { EstudianteController } from './estudiante.controller';
import { PasswordService } from 'src/common/services/password.service';
@Module({
  imports: [EmailModule],
  controllers: [EstudianteController],
  providers: [EstudianteService, PrismaService, ValidationExitsService, GenerateTokenService, PasswordService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
