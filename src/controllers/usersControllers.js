const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccesToken } = require("../libs/jwt.js"); 

const usersService = require("../services/usersService.js")
const service = new usersService();







const registerUser = async (req, res) => {
    const { name, password } = req.body

    try {

        const user = await service.findOneName(name);

        //Verificar si el usuario ya existe
        if (!user) {

            // Hash contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const nullUser = await service.findOneNull();
        
            if (nullUser) {

                await nullUser.service.update({ name, password: hashedPassword });
                res.json({ success: true, data: res });

            } else {

                const res = await service.create({ name, password: hashedPassword })
                res.json({ success: true, data: res });

            };

        } else {
            
            return res.status(404).json({ message: "El usuario ya existe" });

        }
    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

const loginUser = async (req, res) => {
    const {name, password} = req.body;
    
    try {

        const user = await service.findOneName(name);

        //Si el usuario existe y la password está bien, enviar datos
        if (user && (await bcrypt.compare(password, user.password))) {

            //Generar token
            const token = createAccesToken(user.id);

            res.cookie("token", token, {
                sameSite: "none",
                secure: true,
                httpOnly: false
            });

            res.json({ success: true, message: "Iniciaste sesión correctamente" });

        } else {

            return res.status(404).json({ message: "El nombre o la contraseña son incorrectos" });

        }

    } catch (error) {
        
        res.status(500).json({ message: error.message })

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

            await pool.query(`UPDATE users SET user_password = ? WHERE user_id = ?`, [hashedPassword, id]);

            res.json("La contraseña fue actualizada");

            } else {

                return res.status(401).json({ message: "Elige una contraseña distinta a la anterior" });

            };

        } else {
            
            return res.status(404).json({
            message: "La contraseña es incorrecta"
            });

        }
    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

export { registerUser, loginUser, updatePassword };
