const bcrypt = require("bcrypt");
const { createAccesToken } = require("../libs/jwt.js"); 

const UsersService = require("../services/usersService.js")
const service = new UsersService();







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

                res.json({ data: newUser, token: token });


            } else {

                const newUser = await service.create({ email, password: hashedPassword })

                const token = createAccesToken(newUser.id);

                req.user

                res.json({ message: "Te registraste correctamente", data: newUser, token: token });

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

    const id = req.user.id;

    try {
    
        const user = await service.findOneId(id);

        if (user) {

            await user.update({ email: null, password: null});
            return res.json({ message: "El usuario fué eliminado" });
        
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

            return res.json({ message: "Iniciaste sesión correctamente", data: user, token: token });

        } else {

            return res.status(400).json({ message: "El email o la contraseña son incorrectos" });

        }

    } catch (error) {
        
        return res.status(500).json({ message: error.message })

    };

};

const logoutUser = async (req, res) => {
    try {
        // Limpiar la cookie del token de autenticación
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

module.exports = { registerUser, loginUser, updatePassword, logoutUser, deleteUser };