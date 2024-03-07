const jwt = require("jsonwebtoken");
const transporter = require("../libs/nodemailer.js");
const bcrypt = require("bcrypt");
const { createAccesToken, createAccesTokenSendEmail } = require("../libs/jwt.js"); 
const UsersService = require("../services/usersService.js")
const service = new UsersService();

// Generar y almacenar tokens de restablecimiento de contraseña
const sendEmail = async (req, res) => {

    const { email } = req.body;
    const userFound = await service.findOneEmail(email);

    if (!userFound) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const token = createAccesTokenSendEmail(email);

    user.resetPasswordToken = token;

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


const resetPassword = async (req, res) => {

    const { password } = req.body;
    const { token } = req.params;

    try {
        // Buscar el token en la base de datos
        const userFound = await service.findOneToken(token);

        // Verificar si el token existe
        if (!userFound.dataValues.resetPasswordToken) {
            return res.status(404).json({ error: 'Token inválido o expirado' });
        }

        // Generar el hash de la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        jwt.verify(token, process.env.SECRET, async (err, email) => {
            
            const user = await service.findOneEmail(email.email); 
            
             if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
             }

             user.password = hashedPassword;

            await user.save();

            });

        // Responder con un mensaje de éxito
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};




















const registerUser = async (req, res) => {
    
    const { email, password } = req.body;

    try {

        const user = await service.findOneEmail(email);

        //Verificar si el usuario ya existe
        if (!user) {

            // Hash contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const nullUser = await service.findOneNull();
        
            if (nullUser) {

                const newUser = await nullUser.update({ email, password: hashedPassword });

                const token = createAccesToken(newUser.id);

                res.cookie("token", token, {
                    sameSite: "none",
                    secure: true,
                    httpOnly: false
                });

                return res.json({ message: "Iniciaste sesión correctamente", data: {id: newUser.id, email: newUser.email}, token: token });


            } else {

                const newUser = await service.create({ email, password: hashedPassword })

                const token = createAccesToken(newUser.id);

                res.cookie("token", token, {
                    sameSite: "none",
                    secure: true,
                    httpOnly: false
                });

                return res.json({ message: "Iniciaste sesión correctamente", data: {id: newUser.id, email: newUser.email}, token: token });
            
            };

        } else {
            
            return res.status(400).json({ message: "El usuario ya existe" });

        }
    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
};

const deleteUser = async (req, res) => {

    //CONSULTAR SI TAMBIÉN ELIMINARÁ LOS PASAJES TOMADOS. EN CASO DE QUE EL PASAJE NO SE PUEDA ELIMINAR POR FUERA DE TÉRMINO QUE SE HARÁ.

    const email = req.user.email;

    try {
    
        const user = await service.findOneEmail(email);

        if (user) {

            await user.update({ email: null, password: null});
            return res.json({ message: "Cuenta eliminada correctamente" });
        
        }
        else {

            return res.status(400).json({ message: "El usuario no existe" });

        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message });

    }
};

const loginUser = async (req, res) => {

    const {email, password} = req.body;
    
    try {

        const user = await service.findOneEmail(email);

        //Si el usuario existe y la password está bien, enviar datos
        if (user && (await bcrypt.compare(password, user.password))) {

            //Generar token
            const token = createAccesToken(user.id);

            res.cookie("token", token, {
                sameSite: "none",
                secure: true,
                httpOnly: false
            });

            return res.json({ message: "Iniciaste sesión correctamente", data: {id: user.id, email: user.email}, token: token });

        } else {

            return res.status(400).json({ message: "El email o la contraseña son incorrectos" });

        }

    } catch (error) {
        
        return res.status(500).json({ message: error.message })

    };

};

const logoutUser = async (req, res) => {
    try {        // Limpiar la cookie del token de autenticación
        res.clearCookie('token', { sameSite: 'none', secure: true });
        
        // Enviar una respuesta al cliente confirmando que la sesión ha sido cerrada correctamente
        return res.json({ message: "Cerraste sesión correctamente" });

    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso de cierre de sesión
        return res.status(500).json({ message: error.message });
    }
};

const updatePassword = async (req, res) => {

    const { password, newPassword } = req.body
    const id = req.user.id;

    try {
        
        const user = await service.findOneId(id);
        
        const oldPassword = user.password;

        //Verificar si el usuario ya existe
        if (user && await bcrypt.compare(password, oldPassword)) {

            if (!(await bcrypt.compare(newPassword, oldPassword))) {

                // Hash contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await user.update({ password: hashedPassword });

            return res.json({ message: "Se actualizó la contraseña correctamente" });

            } else {

                return res.status(401).json({ message: "Elige una contraseña distinta a la anterior" });

            };

        } else {
            
            return res.status(404).json({

            message: "La contraseña es incorrecta"

            });

        }
    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
};

module.exports = { registerUser, loginUser, updatePassword, logoutUser, deleteUser, sendEmail, resetPassword };