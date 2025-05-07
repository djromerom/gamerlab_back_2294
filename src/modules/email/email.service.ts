import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendConfirmationEmail(createEmailDto: CreateEmailDto) {
    const { emails, token, teamName } = createEmailDto;
    const confirmationUrl = `${this.configService.get('APP_URL')}/confirmar-registro?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM'),
        to: emails,
        subject: 'Confirma tu registro de equipo para el evento de videojuegos',
        html: `
          <h1>¡Hola!</h1>
          <p>Tu equipo "${teamName}" ha sido registrado con éxito.</p>
          <p>Por favor, confirma tu participación haciendo clic en el siguiente enlace:</p>
          <a href="${confirmationUrl}">Confirmar registro</a>
          <p>Este enlace expirará en 24 horas.</p>
          <p>Gracias por participar en nuestro evento de videojuegos académicos.</p>
        `,
      });
    } catch (error) {
      throw new HttpException("Email no enviado", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
