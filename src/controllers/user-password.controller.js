const { User, UserPassword } = require("../db"); // Importamos los modelos de usuario y contraseña
const { generateRandomString, generateHash } = require('../utils/credentials.util'); // Importamos funciones de utilidad para generar cadenas aleatorias y hashes
const { getEmailTemplate } = require('../template/template'); // Importamos una función para obtener una plantilla de correo electrónico
const { sendEmail } = require('../utils/email.util'); // Importamos una función para enviar correos electrónicos

class UserPasswordController {

  // Método para enviar un correo electrónico para restablecer la contraseña
  async sendEmailToResetPassword(req, res) {
    try {
      const { email } = req.params; // Obtenemos el correo electrónico del parámetro de la solicitud

      const user = await User.findOne({
        where: { email: email } // Buscamos un usuario por su correo electrónico
      });

      if (!user) { // Si no se encuentra el usuario, respondemos con un mensaje de error
        return res.status(404).json({ success: false, msg: 'No se encontró el usuario con el email ingresado' });
      }

      // Buscamos una contraseña no utilizada asociada al usuario
      let userPassword = await UserPassword.findOne({
        where: { userId: user.id, isUsed: false }
      });

      if (userPassword) { // Si se encuentra una contraseña no utilizada, la marcamos como utilizada
        userPassword.isUsed = true;
        await userPassword.save();
      }

      // Generamos un token aleatorio
      const token = generateRandomString(16);

      // Creamos una nueva entrada de contraseña en la base de datos
      userPassword = await UserPassword.create({
        userId: user.id,
        email: email,
        token: token,
        isUsed: false
      });

      // Preparamos los datos para la plantilla de correo electrónico
      const data = { email: email, token: token };
      // Obtenemos la plantilla de correo electrónico
      const emailHTMLTemplate = getEmailTemplate(data);

      // Enviamos el correo electrónico
      await sendEmail(email, 'Recuperar contraseña', emailHTMLTemplate);
      res.json({ success: true, email: email, msg: 'Email enviado correctamente!' }); // Respondemos con un mensaje de éxito
    } catch (error) { // Capturamos cualquier error y respondemos con un mensaje de error
      console.log('Error', error.message);
      res.status(500).json({ success: false, msg: 'Error al enviar email' });
    }
  }

  // Método para restablecer la contraseña
  async resetPassword(req, res) {
    try {
      const { token } = req.params; // Obtenemos el token del parámetro de la solicitud
      const { password, password2 } = req.body; // Obtenemos las contraseñas del cuerpo de la solicitud

      // Buscamos una entrada de contraseña por el token
      const userPassword = await UserPassword.findOne({
        where: { token: token }
      });

      if (!userPassword) { // Si no se encuentra una entrada de contraseña, respondemos con un mensaje de error
        return res.status(404).json({ success: false, msg: 'Error: Debe enviar solicitud por correo' });
      }

      if (userPassword.isUsed === true) { // Si el token ya se usó, respondemos con un mensaje de error
        return res.json({ success: false, msg: 'Error: el token ya se usó o expiró' });
      }

      if (password !== password2) { // Si las contraseñas no coinciden, respondemos con un mensaje de error
        return res.json({ success: false, msg: 'Las contraseñas no coinciden' });
      }

      // Marcamos la contraseña como utilizada
      userPassword.isUsed = true;
      await userPassword.save();

      // Buscamos al usuario asociado a la contraseña
      const user = await User.findByPk(userPassword.userId);
      // Generamos el hash de la nueva contraseña
      const passwordHash = generateHash(password);
      // Actualizamos la contraseña del usuario en la base de datos
      user.password = passwordHash;
      await user.save();

      res.json({ success: true, email: user.email, msg: 'Las contraseñas se cambiaron correctamente' }); // Respondemos con un mensaje de éxito
    } catch (error) { // Capturamos cualquier error y respondemos con un mensaje de error
      console.log('Error', error.message);
      res.status(500).json({ success: false, msg: 'Error al restablecer la contraseña' });
    }
  }

}

module.exports = UserPasswordController; // Exportamos el controlador