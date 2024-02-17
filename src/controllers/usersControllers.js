import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import { createAccesToken } from "../libs/jwt.js";

const registerUser = async (req, res) => {
    const { name, password } = req.body

    try {

        const [result] = await pool.query('SELECT * FROM users WHERE user_name = ?', [name]);
        const user = result[0];

        //Verificar si el usuario ya existe
        if (!user) {

            // Hash contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const [result] = await pool.query(`SELECT * FROM users WHERE user_name is null`);
            const nullUser = result[0];

            if (nullUser) {

                await pool.query(`UPDATE users SET user_name = ?, user_password = ? WHERE user_id = ?`, [name, hashedPassword, nullUser.user_id]);

                const [result] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [nullUser.user_id]);
                const newUser = result[0];

                //Enviar los datos del usuario al front

                res.json({

                    id: newUser.user_id,
                    name: newUser.user_name,
                    admin: newUser.user_admin,

                });

            } else {

                //Crear usuario en la base de datos
                await pool.query(`INSERT INTO users (user_name, user_password) VALUES (?, ?)`, [name, hashedPassword]);

                const [result] = await pool.query(`SELECT * FROM users WHERE user_name = ?`, [name]);
                const newUser = result[0];

                //Enviar los datos del usuario como respuesta
                res.json({

                    id: newUser.user_id,
                    name: newUser.user_name,
                    admin: newUser.user_admin,

                });

            };

        } else {
            
            return res.status(404).json({
            message: "El usuario ya existe"
            });

        }
    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

const loginUser = async (req, res) => {
    const {name, password} = req.body;
    
    try {

        //Verificar que el usuario existe
        const [result] = await pool.query('SELECT * FROM users WHERE user_name = ?', [name]);  
        const user = result[0];

        //Si el usuario existe y la password está bien, enviar datos
        if (user && (await bcrypt.compare(password, user.user_password))) {

            //Generar token
            const token = await createAccesToken(user.user_id);

            res.cookie("token", token, {
                sameSite: "none",
                secure: true,
                httpOnly: false
            });

            res.json({

                id: user.user_id,
                fullname: user.user_fullname,
                image: user.user_image,
                admin: user.user_admin,

            });
        } else {

            res.status(404);
            throw new Error("El nombre o la contraseña son inválidos");

        }

    } catch (error) {
        
        res.status(500).json({ message: error.message })

    };

};

const updatePassword = async (req, res) => {
    const { password, newPassword } = req.body
    const id = req.user.user_id;

    try {
        
        const [result] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);  
        const user = result[0];
        
        const oldPassword = user.user_password;

        console.log(password, oldPassword);

        //Verificar si el usuario ya existe
        if (user && await bcrypt.compare(password, oldPassword)) {

            if (!(await bcrypt.compare(newPassword, oldPassword))) {

                // Hash contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await pool.query(`UPDATE users SET user_password = ? WHERE user_id = ?`, [hashedPassword, id]);

            res.json("La contraseña fue actualizada");

            } else {

                return res.status(401).json({
                    message: "Elige una contraseña distinta a la anterior"
                    });

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

const verifyToken = async (req, res) => {
    const {token} = req.cookies

    if (!token) return res.status(401).json({ message: "No hay token"} );

    jwt.verify(token, process.env.SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "El token no es válido" });

    const [result] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user.id]);  
    const userFound = result[0];
    
    if (!userFound) return res.status(401).json({ message: "No se encontró el usuario" });
    
    return res.json({

        id: userFound.user_id,
        fullname: userFound.user_fullname,
        image: userFound.user_image,
        admin: userFound.user_admin,

    });
    })
}

export { registerUser, loginUser, updatePassword, updateProfile, deleteUser, verifyToken, getUsers };
