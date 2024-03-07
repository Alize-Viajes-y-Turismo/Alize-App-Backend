const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true para SSL, false para otros puertos
    auth: {
        user: 'riverista@hotmail.es',
        pass: 'qrbjhiorneqbfube'
    }
});

module.exports = transporter;