const nodemailer = require('nodemailer');

// Crear un objeto transporter para enviar correos electrónicos
const transporter = nodemailer.createTransport({
    // Configuración del servidor SMTP de Office365
    host: 'smtp.office365.com', // Servidor SMTP de Office365
    port: 587, // Puerto para la conexión SMTP
    secure: false, // false para iniciar una conexión no segura, true para iniciar una conexión segura (SSL)
    auth: {
        // Credenciales de autenticación para el servidor SMTP
        user: 'riverista@hotmail.es', // Correo electrónico del remitente
        pass: 'qrbjhiorneqbfube' // Contraseña del remitente
    }
});

module.exports = { transporter };