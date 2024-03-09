const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createAccesToken, createAccesTokenSendEmail } = require("../libs/jwt.js");
const transporter = require("../libs/nodemailer.js");
const UsersServices = require("../services/usersServices.js")
const service = new UsersServices();
const crypto = require('crypto');

// Función para enviar correo electrónico con el código de restablecimiento de contraseña
const sendEmail = async (req, res) => {
    const { email } = req.body;
    // Buscar usuario por correo electrónico
    const userFound = await service.findOneEmail(email);

    if (!userFound) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Generar token de restablecimiento de contraseña
    const token = createAccesTokenSendEmail(email);

    // Almacenar el token en la base de datos para el usuario
    userFound.resetPasswordToken = token;
    await userFound.save();

    // Enviar correo electrónico de restablecimiento de contraseña
    const mailOptions = {
        from: "riverista@hotmail.es",
        to: email,
        subject: "Restablecer contraseña",
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://tuapp.com/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Error al enviar el correo electrónico" });
        } else {
            console.log("Correo electrónico enviado: " + info.response);
            res.status(200).json({ message: "Correo electrónico enviado con éxito" });
        }
    });
};

// Función para restablecer la contraseña
const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        // Buscar usuario por token de restablecimiento de contraseña
        const userFound = await service.findOneToken(token);

        // Verificar si el token existe
        if (!userFound || !userFound.resetPasswordToken) {
            return res.status(404).json({ error: "Token inválido o expirado" });
        }

        // Generar hash de la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Decodificar el token para obtener el correo electrónico
        jwt.verify(token, process.env.SECRET, async (err, email) => {
            if (err) {
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            const userFoundByEmail = await service.findOneEmail(email.email); 
            if (!userFoundByEmail) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            // Actualizar la contraseña del usuario en la base de datos
            userFoundByEmail.password = hashedPassword;
            await userFoundByEmail.save();
            res.status(200).json({ message: "Contraseña actualizada exitosamente" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const user = await service.findOneEmail(email);
        if (user) {
            return res.status(400).json({ message: "El usuario ya existe." });
        }

        // Hash contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario en la base de datos
        const newUser = await service.create({ email, password: hashedPassword });

        // Generar token de acceso
        const token = createAccesToken(newUser.id);

        // Enviar correo electrónico de verificación
        const verificationCode = crypto.randomBytes(3).toString("hex");
        const mailOptions = {
            from: "riverista@hotmail.es",
            to: email,
            subject: "Código de verificación",
            text: `Tu código de verificación es: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: "Error al enviar el correo electrónico" });
            } else {
                console.log("Correo electrónico enviado: " + info.response);
                res.status(200).json({ message: "Correo electrónico enviado con éxito" });
            }
        });

        return res.json({ message: "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.", data: { id: newUser.id, email: newUser.email }, token: token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Función para eliminar un usuario
const deleteUser = async (req, res) => {
    const email = req.user.email;
    try {
        // Buscar usuario por correo electrónico
        const userFound = await service.findOneEmail(email);
        if (!userFound) {
            return res.status(400).json({ message: "El usuario no existe" });
        }

        // Eliminar usuario de la base de datos
        await userFound.update({ email: null, password: null});
        return res.json({ message: "Cuenta eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Función para iniciar sesión de usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscar usuario por correo electrónico
        const user = await service.findOneEmail(email);
        // Si el usuario existe y la contraseña es correcta, generar token de acceso
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = createAccesToken(user.id);
            res.cookie("token", token, {
                sameSite: "none",
                secure: true,
                httpOnly: false
            });
            return res.json({ message: "Iniciaste sesión correctamente", data: { id: user.id, email: user.email }, token: token });
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

                return res.status(400).json({ message: "Elige una contraseña distinta a la anterior" });

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