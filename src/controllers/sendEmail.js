const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User } = require('../models/User.js'); // Suponiendo que tengas un modelo de usuario con Sequelize
const UsersService = require("../services/usersService.js")
const service = new UsersService();

// Configuración de transporte de correo
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true para SSL, false para otros puertos
    auth: {
        user: 'riverista@hotmail.es',
        pass: 'qrbjhiorneqbfube'
    }
});

// Generar y almacenar tokens de restablecimiento de contraseña
const sendEmail = async (req, res) => {
    const { email } = req.body;
    const user = await service.findOneEmail(email);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validez del token
    await user.save();

    // Enviar correo electrónico de restablecimiento de contraseña
    const mailOptions = {
        from: 'riverista@hotmail.es',
        to: email,
        subject: 'Restablecer contraseña',
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://tuapp.com/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
            res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
        }
    });
};

module.exports =  sendEmail ;

