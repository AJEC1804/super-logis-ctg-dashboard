const nodemailer = require('nodemailer');

// Email configuration
let transporter = null;

function getTransporter() {
  if (!transporter) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'escutechsolutions@gmail.com',
          pass: process.env.SMTP_PASS || 'osso eyxm avln jpic'
        }
      });
    } catch (error) {
      console.error('Error initializing email transporter:', error);
      return null;
    }
  }
  return transporter;
}

// Send verification email
async function sendVerificationEmail(email, code) {
  try {
    const transport = getTransporter();
    if (!transport) return false;
    
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'escutechsolutions@gmail.com',
      to: email,
      subject: '🔐 Código de Verificación - SUPER LOGISTICA',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0b2b45 0%, #1a3a52 100%); color: white; padding: 20px; border-radius: 8px; }
              .content { padding: 20px; background: #f5f7fa; margin-top: 20px; border-radius: 8px; }
              .code { background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
              .code-text { font-size: 32px; font-weight: bold; color: #0099cc; letter-spacing: 5px; }
              .footer { text-align: center; color: #999; margin-top: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡Bienvenido a SUPER LOGISTICA!</h1>
              </div>
              <div class="content">
                <p>Hola,</p>
                <p>Para completar tu registro, usa el siguiente código de verificación:</p>
                <div class="code">
                  <div class="code-text">${code}</div>
                </div>
                <p>Este código expira en 30 minutos.</p>
                <p>Si no solicitaste este código, por favor ignora este correo.</p>
              </div>
              <div class="footer">
                <p>© 2026 SUPER LOGISTICA. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// Send welcome email
async function sendWelcomeEmail(email, name) {
  try {
    const transport = getTransporter();
    if (!transport) return false;
    
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'escutechsolutions@gmail.com',
      to: email,
      subject: '¡Bienvenido a SUPER LOGISTICA!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0b2b45 0%, #1a3a52 100%); color: white; padding: 20px; border-radius: 8px; }
              .content { padding: 20px; background: #f5f7fa; margin-top: 20px; border-radius: 8px; }
              .features { list-style: none; padding: 0; }
              .features li { padding: 10px 0; border-bottom: 1px solid #ddd; }
              .features li:before { content: "✓ "; color: #0099cc; font-weight: bold; margin-right: 10px; }
              .footer { text-align: center; color: #999; margin-top: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡Cuenta Creada Exitosamente!</h1>
              </div>
              <div class="content">
                <p>Hola ${name},</p>
                <p>Tu cuenta ha sido activada exitosamente. Ahora puedes disfrutar de todos nuestros servicios:</p>
                <ul class="features">
                  <li>Rastreo en tiempo real de envíos</li>
                  <li>Panel de control personalizado</li>
                  <li>Gestión de flota</li>
                  <li>Reportes detallados</li>
                  <li>Soporte prioritario</li>
                </ul>
                <p><strong>Próximos pasos:</strong></p>
                <p>Accede a tu cuenta y completa tu perfil para obtener la mejor experiencia.</p>
              </div>
              <div class="footer">
                <p>© 2026 SUPER LOGISTICA. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

// Send bulk email
async function sendBulkEmail(recipients, subject, htmlContent) {
  try {
    const transport = getTransporter();
    if (!transport) return false;
    
    for (const email of recipients) {
      await transport.sendMail({
        from: process.env.SMTP_FROM || 'escutechsolutions@gmail.com',
        to: email,
        subject: subject,
        html: htmlContent
      });
    }
    return true;
  } catch (error) {
    console.error('Error sending bulk email:', error);
    return false;
  }
}

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendBulkEmail,
  getTransporter
};
