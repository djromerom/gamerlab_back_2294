import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/common/services/password.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService
  ) {}


  
  async getUsers() {
    return await this.prismaService.usuario.findMany();
  }

  async signUp(nombre_completo: string, email: string, password: string) {
    try {
      const userFound = await this.prismaService.usuario.findUnique({
        where: { email },
      });

      if (userFound) throw new BadRequestException('El usuario ya existe');

      const hashedPassword = await this.passwordService.hashPassword(password);

      const usuario = await this.prismaService.usuario.create({
        data: {
          nombre_completo,
          email,
          hash_contrasena: hashedPassword,
        },
      });


      const { hash_contrasena, ...userWithoutPassword } = usuario;
      const payload = { ...userWithoutPassword };
      const accessToken = await this.jwtService.signAsync({ payload });

      return { accessToken };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const user = await this.prismaService.usuario.findUnique({
        where: { email },
      });
  
      if (!user) {
        throw new BadRequestException('Credenciales incorrectas');
      }
  
      const isMatch = await this.passwordService.comparePassword(password, user.hash_contrasena);
      if (!isMatch) {
        throw new BadRequestException('Credenciales incorrectas');
      }
      const { hash_contrasena, ...userWithoutPassword } = user;
      const payload = { ...userWithoutPassword };
      const accessToken = await this.jwtService.signAsync({ payload });

      return { accessToken };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error en signIn");
    }
  }
}

  



