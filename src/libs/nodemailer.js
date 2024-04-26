const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    auth: {
        user: 'pr3ue3bas@hotmail.com',
        pass: 'pruebas123321'
    }
});

module.exports = transporter;