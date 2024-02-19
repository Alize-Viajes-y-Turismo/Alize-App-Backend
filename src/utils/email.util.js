const nodemailer = require('nodemailer');
const { mail } = require('../config/email.config');

// esto le llegara al correo

const sendEmail = async (email, subject, html) => {
  await emailTransporter.sendMail({
    from: `MHCode <${ mail.user }>`,
    to: email,
    subject: subject,
    html: html
  });
}

module.exports = {
  sendEmail
}