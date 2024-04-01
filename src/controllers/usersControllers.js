const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const  { createAccessToken }  = require("../libs/jwt.js");
const { transporter } = require("../libs/nodemailer.js");
const UsersServices = require("../services/usersServices.js")
const service = new UsersServices();
const crypto = require('crypto');


// Función para enviar correo electrónico con el código de restablecimiento de contraseña
const sendEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Buscar usuario por correo electrónico
        const userFound = await service.findOneEmail(email);

        if (!userFound) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Generar código de verificación
        const verificationCode = crypto.randomBytes(3).toString("hex");

        // Configurar opciones del correo electrónico
        const mailOptions = {
            from: "riverista@hotmail.es",
            to: email,
            subject: "Restablecer contraseña",
            text: `Tu código de verificación es: ${verificationCode}`
        };

        // Asignar y guardar el código de verificación en la base de datos
        userFound.pin = verificationCode;
        await userFound.save();

        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al enviar el correo electrónico" });
            } else {
                console.log("Correo electrónico enviado: " + info.response);
                return res.status(200).json({ message: "Correo electrónico enviado con éxito" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Función para restablecer la contraseña
const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Generar un hash de la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buscar usuario por correo electrónico
        const userFoundByEmail = await service.findOneEmail(email);
        if (!userFoundByEmail) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Actualizar la contraseña del usuario en la base de datos
        userFoundByEmail.password = hashedPassword;
        await userFoundByEmail.save();

        return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
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
        const token = createAccessToken(newUser.id);

        // Enviar correo electrónico de verificación
        const verificationCode = crypto.randomBytes(3).toString("hex");
        const mailOptions = {
            from: "riverista@hotmail.es",
            to: email,
            subject: "Código de verificación",
            text: `Tu código de verificación es: ${verificationCode}`
        };

        newUser.pin = verificationCode;
        await newUser.save();

        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al enviar el correo electrónico" });
            } else {
                console.log("Correo electrónico enviado: " + info.response);
            }
        });

        return res.status(200).json({ message: "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.", data: { id: newUser.id, email: newUser.email }, token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Función para eliminar un usuario
const deleteUser = async (req, res) => {
    const email = req.user.email;

    try {
        // Buscar usuario por correo electrónico
        const userFound = await service.findOneEmail(email);
        if (!userFound) {
            return res.status(404).json({ message: "El usuario no existe" });
        }

        // Eliminar usuario de la base de datos (simular eliminación)
        await userFound.update({ email: null, password: null });

        return res.json({ message: "Cuenta eliminada correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
// Función para iniciar sesión de usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Buscar usuario por correo electrónico
        const user = await service.findOneEmail(email);
        
        // Si el usuario existe y la contraseña es correcta, generar token de acceso
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = createAccessToken(user.id);
            
            // Configurar cookie con el token de acceso
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
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};


// Función para cerrar sesión de usuario
const logoutUser = async (req, res) => {
    try {
        // Limpiar la cookie del token de autenticación
        res.clearCookie('token', { sameSite: 'none', secure: true });
        
        // Enviar una respuesta al cliente confirmando que la sesión ha sido cerrada correctamente
        return res.json({ message: "Cerraste sesión correctamente" });
    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso de cierre de sesión
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};


// Función para verificar el pin 
const verification = async (req, res) => {
    const { code } = req.body;

    try {
        // Buscar usuario por código de verificación
        const user = await service.findOnePin(code);

        // Verificar si se encontró un usuario y si el código de verificación es válido
        if (!user || user.pin !== code) {
            return res.status(404).json({ error: "Código de verificación inválido o expirado" });
        }

        // El código de verificación es válido
        return res.status(200).json({ message: "Código de verificación correcto" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};


// Función para actualizar contraceña
const updatePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    const id = req.user.id;

    try {
        // Buscar usuario por ID
        const user = await service.findOneId(id);

        // Verificar si el usuario existe y la contraseña actual es correcta
        if (user && await bcrypt.compare(password, user.password)) {
            // Verificar si la nueva contraseña es diferente a la anterior
            if (!(await bcrypt.compare(newPassword, user.password))) {
                // Generar hash de la nueva contraseña
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

                // Actualizar la contraseña del usuario en la base de datos
                await user.update({ password: hashedPassword });

                return res.json({ message: "Se actualizó la contraseña correctamente" });
            } else {
                return res.status(400).json({ message: "Elige una contraseña distinta a la anterior" });
            }
        } else {
            return res.status(404).json({ message: "La contraseña actual es incorrecta" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};



module.exports = { registerUser, loginUser, updatePassword, logoutUser, deleteUser, verification, sendEmail, resetPassword };