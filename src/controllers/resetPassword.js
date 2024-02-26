const bcrypt = require('bcrypt');
const { User } = require('../models/User.js');
const UsersService = require("../services/usersService.js")
const service = new UsersService();

const resetPassword = async (req, res) => {
    const { password, password2 } = req.body;
    const { token } = req.params;

    try {
        // Buscar el token en la base de datos
        const Token = await service.findOne(token);

        // Verificar si el token existe
        if (!Token) {
            return res.status(404).json({ error: 'Token inválido o expirado' });
        }

        // Verificar si las contraseñas coinciden
        if (password !== password2) {
            return res.status(400).json({
                success: false,
                msg: 'Las contraseñas no coinciden'
            });
        }

        // Generar el hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizar la contraseña del usuario
        const user = await User.findOne({ where: { email: token.email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        user.password = hashedPassword;
        await user.save();

        // Responder con un mensaje de éxito
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = resetPassword;