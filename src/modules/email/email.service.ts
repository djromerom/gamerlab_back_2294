import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateEmailDto } from './dto/email.dto';
import { CreateEmailJuradoDto } from './dto/email-jurado.dto';

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
    
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const currentToken = token[i];
      console.log('Sending email to:', email, 'with token:', currentToken);

      const confirmationUrl = `${this.configService.get('APP_URL')}/api/v1/equipo/confirmar?token=${currentToken}`;
      try {
        await this.transporter.sendMail({
          from: this.configService.get('MAIL_FROM'),
          to: email,
          subject: 'Confirma tu registro para el evento de videojuegos académicos',
          html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirmación de Registro</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background-color: #f9f9f9;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                  background: linear-gradient(135deg, #6b45bc, #4285f4);
                  border-radius: 8px 8px 0 0;
                  margin: -20px -20px 20px;
                }
                .header h1 {
                  color: white;
                  margin: 0;
                  font-size: 24px;
                  font-weight: 700;
                }
                .logo {
                  margin-bottom: 15px;
                  max-width: 150px;
                }
                .content {
                  padding: 20px;
                }
                .team-name {
                  font-weight: bold;
                  color: #6b45bc;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #6b45bc, #4285f4);
                  color: white;
                  text-decoration: none;
                  border-radius: 30px;
                  font-weight: bold;
                  margin: 20px 0;
                  text-align: center;
                  box-shadow: 0 2px 5px rgba(107,69,188,0.3);
                  transition: all 0.3s ease;
                }
                .button:hover {
                  background: linear-gradient(135deg, #5a3aa0, #3367d6);
                  box-shadow: 0 4px 8px rgba(107,69,188,0.5);
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                  color: #888;
                  font-size: 12px;
                }
                .note {
                  font-size: 14px;
                  background-color: #f8f9fa;
                  padding: 15px;
                  border-radius: 6px;
                  border-left: 4px solid #4285f4;
                  margin: 20px 0;
                }
                @media only screen and (max-width: 600px) {
                  .container {
                    width: 100%;
                    padding: 10px;
                  }
                  .content {
                    padding: 10px;
                  }
                  .header {
                    padding: 15px 0;
                  }
                  .header h1 {
                    font-size: 20px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Feria de Videojuegos Académicos</h1>
                </div>
                <div class="content">
                  <h2>¡Registro exitoso!</h2>
                  <p>Hola,</p>
                  <p>Nos complace informarte que el equipo <span class="team-name">"${teamName}"</span> ha sido registrado con éxito en nuestro evento de videojuegos académicos.</p>
                  
                  <p>Para completar tu registro y confirmar tu participación, por favor haz clic en el botón de abajo:</p>
                  
                  <div style="text-align: center;">
                    <a href="${confirmationUrl}" class="button">Confirmar Participación</a>
                  </div>
                  
                  <div class="note">
                    <strong>Nota:</strong> Este enlace de confirmación expirará en 24 horas. Si no confirmas antes de este tiempo, tendrás que registrarte nuevamente.
                  </div>
                  
                  <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                  <p style="word-break: break-all; font-size: 12px; color: #666;">${confirmationUrl}</p>
                  
                  <p>Esperamos con entusiasmo ver tu proyecto en la Feria de Videojuegos Académicos.</p>
                  
                  <p>¡Gracias por participar!</p>
                </div>
                <div class="footer">
                  <p>© 2025 Feria de Videojuegos Académicos - Universidad del Norte</p>
                  <p>Este es un correo automático, por favor no responder.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        
        console.log('Email sent successfully to:', emails);
        return true;
      } catch (error) {
        console.error('Failed to send email:', error);
        throw new HttpException(`Email no enviado: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    };

  }

  async sendJuradoInvitation({email, token} : CreateEmailJuradoDto) {
    const confirmUrl = `${this.configService.get('APP_URL')}/jurados/confirmar/${token}`;
    
    this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Bienvenido a GameLab - Confirmación de Jurado',
      html: `
        <h1>Bienvenido a GameLab</h1>
        <p>Has sido seleccionado como jurado para evaluar videojuegos.</p>
        <p>Por favor confirma tu participación haciendo clic en el siguiente botón:</p>
        <a href="${confirmUrl}" 
           style="padding: 10px 20px; background: #4CAF50; color: white; 
                  text-decoration: none; border-radius: 5px;">
          Aceptar invitación y acceder
        </a>
      `
    });
  }
}
