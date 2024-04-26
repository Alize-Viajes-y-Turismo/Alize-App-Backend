const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createAccesToken } = require("../libs/jwt.js");
const transporter = require("../libs/nodemailer.js");
const crypto = require('crypto');
const { User } = require("../db");

const verifyCode = async (req, res) => {
    const { userCode } = req.body;
    try {
        if (!userCode) {
            return res.status(422).json({ 
                message: "El código de usuario es requerido",
                success: false
            });
        }
        const userFound = await User.findOne({ 
            where: { emailVerificationCode: userCode }, 
            attributes: ['emailVerificationCode', 'emailVerificationCodeExpiresAt'] 
        });
        if (!userFound) {
            return res.status(404).json({ 
                message: "Código de verificación no encontrado",
                success: false
            });
        }
        if (userFound.emailVerificationCode === userCode && userFound.emailVerificationCodeExpiresAt > new Date()) {
            return res.status(200).json({ 
                success: true 
            });
        } else if (userFound.emailVerificationCode !== userCode) {
            return res.status(422).json({ 
                message: "El código ingresado es incorrecto",
                success: false
            });
        } else if (userFound.emailVerificationCodeExpiresAt <= new Date()) {
            return res.status(422).json({ 
                message: "El código de verificación ha expirado",
                success: false
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            success: false 
        });
    }
};

const verifyUser = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(422).json({ 
                message: "Correo electrónico es requerido",
                success: false
            });
        }
        const userFound = await User.findOne({ 
            where: { email },
            attributes: ['id'] 
        });
        if (!userFound) {
            return res.status(404).json({ 
                message: "Usuario no encontrado",
                success: false
            });
        }
        await userFound.update({ verified: true });
        return res.status(200).json({ 
            success: true 
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            success: false 
        });
    }
};

const sendEmailVerificationCode = async (req, res) => {
    const { email } = req.body;
    const code = crypto.randomBytes(3).toString("hex");
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 5); // Código válido por 5 minutos
    const mailOptions = {
        from: "pr3ue3bas@hotmail.com",
        to: email,
        subject: "Código de verificación",
        text: `Tu código de verificación es: ${code}`
    };
    try {
        if (!email) {
            return res.status(422).json({ 
                message: "Correo electrónico es requerido",
                success: false
            });
        }
        const userFound = await User.findOne({ 
            where: { email },
            attributes: ['id'] 
        });
        if (!userFound) {
            return res.status(404).json({ 
                message: "Usuario no encontrado",
                success: false
            });
        }
        await userFound.update({
            emailVerificationCode: code,
            emailVerificationCodeExpiresAt: expirationDate,
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ 
                    message: "Error al enviar el correo electrónico",
                    success: false 
                });
            } else {
                console.log("Correo electrónico enviado: " + info.response);
                return res.status(200).json({ 
                    message: "Correo electrónico enviado con éxito",
                    success: true 
                });
            }
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            success: false 
        });
    };
};

const registerUser = async (req, res) => {
    const {name, email, password } = req.body;
    try {
        if (!email || !password || !name) {
            return res.status(422).json({ 
                message: "Todos los campos son obligatorios",
                success: false
            });
        }
        const userFound = await User.findOne({ 
            where: { email },
            attributes: ['id'] 
        });
        if (userFound) {
            return res.status(409).json({ 
                message: "El usuario ya existe.",
                success: false 
            });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({ name, email, password: hashedPassword });
            return res.status(201).json({ 
                data: newUser, 
                success: true 
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            success: false 
        });
    };
};

const recoveryPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        if (!email || !newPassword) {
            return res.status(422).json({ 
                message: "Correo electrónico y nueva contraseña son requeridos",
                success: false
            });
        }
        const userFound = await User.findOne({ 
            where: { email },
            attributes: ['password'] 
        });
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        userFound.password = hashedNewPassword;
        await userFound.save();
        return res.status(200).json({ 
            message: "Contraseña actualizada exitosamente",
            success: true 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            success: false 
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(422).json({ 
                message: "Correo electrónico y contraseña son requeridos",
                success: false
            });
        }
        const user = await User.findOne({ 
            where: { email },
            attributes: ['id', 'email', 'password', 'verified'] 
        });
        if (!user) {
            return res.status(404).json({ 
                message: "El email o la contraseña son incorrectos", 
                success: false 
            });
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ 
                message: "El email o la contraseña son incorrectos", 
                success: false 
            });
        }
        if (!user.verified) {
            return res.json({ 
                message: "El usuario no está verificado",
                verified: false,
                data: user, 
                success: true 
            });
        }
        const token = createAccesToken(user.id, user.verified);
        res.cookie("token", token, {
            sameSite: "none",
            secure: true,
            httpOnly: false
        });
        return res.json({ 
            message: "Iniciaste sesión correctamente", 
            token: token, 
            success: true,
            verified: true
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
};

const verifyTokenNavigation = async (req, res, next) => {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(422).json({ 
                message: "No hay token",
                success: false
            });
        } else {
            jwt.verify(token, process.env.SECRET, async (err, user) => {
                if (err) return res.status(401).json({ 
                    message: "El token no es válido",
                    success: false 
                });
                const userFound = await User.findOne({ where: { id: user.id } }); 
                if (!userFound) return res.status(404).json({ 
                    message: "No se encontró el usuario",
                    success: false 
                });
                // Si todo está bien, envía el usuario encontrado como respuesta con un código de estado 200 (OK)
                res.status(200).json({
                    success: true,
                    data: userFound
                });
            });
        }
    } catch (error) {
        // Si ocurre un error interno del servidor, devuelve un código de estado 500 (Error interno del servidor)
        return res.status(500).json({ 
            message: error.message,
            success: false 
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password, newPassword } = req.body;
        if (!password || !newPassword) {
            return res.status(422).json({ 
                message: "Contraseña actual y nueva contraseña son requeridas",
                success: false
            });
        }
        const user = await User.findByPk(userId);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ 
                message: "La contraseña actual es incorrecta",
                success: false 
            });
        }
        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(422).json({ 
                message: "Elige una contraseña distinta a la anterior",
                success: false 
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await user.update({ password: hashedPassword });
        return res.json({ 
            message: "Se actualizó la contraseña correctamente",
            success: true 
        });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        return res.status(500).json({ 
            message: "Se produjo un error al actualizar la contraseña",
            success: false 
        });
    }
};

const updateName = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password, newName } = req.body;
        if (!password || !newName) {
            return res.status(422).json({ 
                message: "Contraseña y nuevo nombre son requeridos",
                success: false
            });
        }
        const user = await User.findByPk(userId);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ 
                message: "La contraseña es incorrecta",
                success: false 
            });
        }
        user.name = newName;
        await user.save();
        return res.status(200).json({ 
            message: "Nombre actualizado correctamente",
            success: true 
        });
    } catch (error) {
        console.error("Error al actualizar el nombre:", error);
        return res.status(500).json({ 
            message: "Se produjo un error al actualizar el nombre",
            success: false 
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', { sameSite: 'none', secure: true });
        return res.json({ 
            message: "Cerraste sesión correctamente", 
            success: true 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
};

const getProfileData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userFound = await User.findOne({ 
            where: { id: userId },
            attributes: ['name', 'email'] 
        });
        if (userFound) {
            return res.status(200).json({
                success: true,
                data: userFound
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "El usuario no se encontró en la base de datos"
            });
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Se produjo un error al obtener los datos del usuario"
        });
    }
};

module.exports = { registerUser, verifyCode, loginUser, updatePassword, logoutUser, sendEmailVerificationCode, recoveryPassword, verifyTokenNavigation, verifyUser, getProfileData, updateName };
