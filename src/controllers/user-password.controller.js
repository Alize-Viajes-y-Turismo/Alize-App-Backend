const User = require('../models/User');
const { generateRandomString, generateHash } = require('../utils/credentials.util');
const { getEmailTemplate } = require('../template/template');
const { sendEmail } = require('../utils/email.util');

class UserPasswordController {

  async sendEmailToResetPassword(req, res) {
    try {

// recibo un email del front

      const { email } = req.params;

// verifico que este en la base de datos

      const user = await User.findOne({
        where: {
          email: email
        }
      });

      if(!user) {
        return res.json({
          success: false,
          msg: 'El email es incorrecto'
        });
      }

// si coinciden busco el id del usuario

      let userPassword = await User.findOne({
        where: {
          Id: id.getDataValue('id'),
        }
      });

      if (userPassword) {
        userPassword.setDataValue('isUsed', true);
        await userPassword.save();
      }

      const token = generateRandomString(16);

      userPassword = new UserPassword({
        email: email,
        token: token,
      });

      const data = {
        email: email,
        token: token
      }

      const emailHTMLTemplate = getEmailTemplate(data);

      await sendEmail(email, 'Recuperar contraseña', emailHTMLTemplate);
      await userPassword.save();


      // si todo salio bien, le llegaria un correo para recuperar contraseña


      res.json({
        success: true,
        email: email,
        token: token,
        msg: 'Email enviado correctamente!'
      });
      
    } catch (error) {
      console.log('Error', error.message);
      res.json({
        success: false,
        msg: 'Error al enviar email'
      });
    }
  }

// restablecer contraseña

  async resetPassword(req, res) {
    try {
      
      const { token } = req.params;
      const { password, password2 } = req.body;

// si el token coincide con el que le llego al correo le dejara cambiar la contraseña

      const userPassword = await User.findOne({
        where: {
          token: token
        }
      });

      if (!userPassword) {
        return res.json({
          success: false,
          msg: 'Error: Debe enviar solicitud por correo'
        });
      }

      if(userPassword.getDataValue('isUsed') === true) {
        return res.json({
          success: false,
          msg: 'Error: el token ya se usó o expiró'
        });
      }

      if (password !== password2) {
        return res.json({
          success: false,
          msg: 'Las contraseñas no coinciden'
        });
      }

      userPassword.setDataValue('isUsed', true);
      await userPassword.save();

      const user = await User.findByPk(userPassword.getDataValue('userId'));
      const passwordHash = generateHash(password);
      user.setDataValue('password', passwordHash);

// si todo salio bien se guardara la nueva contraseña

      await user.save();
      res.json({
        success: true,
        email: user.getDataValue('email'),
        msg: 'Las contraseñas se cambiaron correctamente'
      });

    } catch (error) {
      console.log('Error', error.message);
      res.json({
        success: false,
        msg: 'Error al enviar email'
      });
    }
  }

}

module.exports = UserPasswordController;