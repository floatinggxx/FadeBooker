const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    
    // Solo configurar si hay credenciales disponibles
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  async sendResetPasswordEmail(email, token) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"FadeBooker" <${process.env.EMAIL_USER || 'no-reply@fadebooker.com'}>`,
      to: email,
      subject: 'Recuperación de contraseña - FadeBooker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #3366FF; text-align: center;">Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña en <strong>FadeBooker</strong>. Haz clic en el siguiente botón para continuar:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3366FF; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
          </div>
          <p>Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
      `,
    };

    if (this.transporter) {
      try {
        console.log(`[EmailService] Intentando enviar correo a ${email} usando ${process.env.EMAIL_USER}...`);
        await this.transporter.sendMail(mailOptions);
        console.log(`[EmailService] Correo de recuperación enviado a ${email}`);
        return true;
      } catch (error) {
        console.error(`[EmailService] Error crítico detallado:`, {
          message: error.message,
          code: error.code,
          command: error.command,
          response: error.response
        });
        throw new Error('No se pudo enviar el correo de recuperación');
      }
    } else {
      console.warn(`[EmailService] SMTP no configurado. Token para ${email}: ${token}`);
      console.log(`URL de recuperación: ${resetUrl}`);
      // En modo desarrollo sin email, podemos "simular" éxito
      return true;
    }
  }
}

module.exports = new EmailService();
