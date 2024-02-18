const bcrypt = require("bcrypt");
const { createAccesToken } = require("../libs/jwt.js"); 

const UsersService = require("../services/usersService.js")
const service = new UsersService();







const registerUser = async (req, res) => {
    const { email, password } = req.body

    try {

        const user = await service.findOneEmail(email);

        //Verificar si el usuario ya existe
        if (!user) {

            // Hash contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const nullUser = await service.findOneNull();
        
            if (nullUser) {

                const newUser = await nullUser.service.update({ email, password: hashedPassword });

                return res.json({ success: true, data: newUser });

            } else {

                const newUser = await service.create({ email, password: hashedPassword })

                return res.json({ success: true, data: newUser });

            };

        } else {
            
            return res.status(404).json({ message: "El usuario ya existe" });

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

            return res.json({ success: true, message: "Iniciaste sesión correctamente" });

        } else {

            return res.status(404).json({ message: "El nombre o la contraseña son incorrectos" });

        }

    } catch (error) {
        
        return res.status(500).json({ message: error.message })

    };

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

module.exports = { registerUser, loginUser, updatePassword };
