import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { PasswordService } from 'src/common/services/password.service';
import { EmailModule } from 'src/modules/email/email.module';
import { RolesGuard } from './guards/roles.guard';


@Module({
  imports: [
    PrismaModule,
    EmailModule, 
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    })
  ],
  controllers: [AuthController],
  //providers: [AuthService, { provide: 'APP_GUARD', useClass: AuthGuard }, PasswordService],
  providers: [
    AuthService,
    AuthGuard,
    PasswordService,
    RolesGuard
  ],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
