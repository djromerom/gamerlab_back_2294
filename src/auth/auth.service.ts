import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/common/services/password.service';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private emailService: EmailService,
  ) {}

  async signUp(nombre_completo: string, email: string) {
    try {
      const userFound = await this.prismaService.usuario.findUnique({
        where: { email, deleted: false },
      });

      if (userFound) throw new BadRequestException('El usuario ya existe');

      const hashedPassword = await this.passwordService.hashPassword(await this.passwordService.randomPassword(10));
      const token = await this.passwordService.hashPassword(email);

      const usuario = await this.prismaService.usuario.create({
        data: {
          nombre_completo,
          email,
          hash_contrasena: hashedPassword,
          token_confirmacion: token,
        },
      });


      const { hash_contrasena, ...userWithoutPassword } = usuario;
      const payload = { ...userWithoutPassword };
      const accessToken = await this.jwtService.signAsync({ payload });

      await this.emailService.sendEmailProfesor({
        email,
        token
      });

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
        include: {
          roles: {
            include: {
              rol: {
                select: {
                  nombre: true,
                }
              }
            },
          }
        }
      });
  
      if (!user) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }
  
      const isMatch = await this.passwordService.comparePassword(password, user.hash_contrasena);
      if (!isMatch) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }
      const { hash_contrasena, ...userWithoutPassword } = user;
      const payload = { ...userWithoutPassword };
      const accessToken = await this.jwtService.signAsync({ payload });

      return { accessToken, user: userWithoutPassword };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException("Error en signIn");
    }
  }

  async validateUser(token: string) {
    return this.prismaService.usuario.findFirst({
      where: { 
        token_confirmacion: token,
        deleted: false 
      },
      include: {
        roles: {
          where: { deleted: false },
          include: {
            rol: {
              select: {
                nombre: true,
              }
            }
          }
        }
      }
    });
  }

  async validateUserById(id: number) {
    try {
      const user = await this.prismaService.usuario.findFirst({
        where: {
          id,
          deleted: false
        },
        include: {
          roles: {
            where: { deleted: false },
            include: {
              rol: {
                select: {
                  nombre: true,
                }
              }
            }
          }
        }
      })
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      return true;

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return false;
      }
      throw new InternalServerErrorException('Error al validar usuario');
    }

  }

  async createPasswordHash( password: string, token: string) {
    const user = await this.validateUser(token);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    await this.prismaService.usuario.update({
      where: { id: user.id },
      data: { hash_contrasena: hashedPassword, token_confirmacion: null },
    });
  }
}

  



