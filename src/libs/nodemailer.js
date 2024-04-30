const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    auth: {
        user: '',
        pass: ''
    }
});

module.exports = transporter;