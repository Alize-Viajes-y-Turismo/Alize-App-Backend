
const nodemailer = require('nodemailer'); // Importa el módulo nodemailer
const { mail } = require('../config/email.config'); // Importa la configuración del correo electrónico desde el archivo email.config.js


// Crea un transportador de correo electrónico con la configuración proporcionada
const emailTransporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  tls: {
    rejectUnauthorized: false
  },
  secure: false,
  auth: {
    user: "riverista@hotmail.es",
    pass: "Tonchy123"
  }
});

// Función para enviar un correo electrónico con los parámetros proporcionados
const sendEmail = async (email, subject, html) => {
  // Utiliza el transportador de correo electrónico para enviar el correo electrónico
  await emailTransporter.sendMail({
    from: `MHCode <${ mail.user }>`, // Dirección de correo electrónico del remitente
    to: email, // Dirección de correo electrónico del destinatario
    subject: subject, // Asunto del correo electrónico
    text: 'Hola amigos, suscríbance para más videos', // Texto sin formato del correo electrónico
    html: html // Contenido HTML del correo electrónico
  });
}

// Exporta la función sendEmail para que pueda ser utilizada por otros módulos
module.exports = {
  sendEmail
}