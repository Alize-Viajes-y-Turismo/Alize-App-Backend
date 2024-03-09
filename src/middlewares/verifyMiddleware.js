const jwt = require("jsonwebtoken");
const UsersServices = require("../services/usersServices.js")
const service = new UsersServices();

const verifyToken = async (req, res, next) => {
    const {token} = req.cookies

    if (!token) {

        return res.status(400).json({ message: "No hay token"} );
    
    } else {

    jwt.verify(token, process.env.SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "El token no es válido" });
        
        const userFound = await service.findOneId(user.id);  
            
        if (!userFound) return res.status(401).json({ message: "No se encontró el usuario" });
        
        req.user = userFound

        next();
        })
    }
}

const verifyAdmin = async (req, res, next) => {

    const { token } = req.cookies

    try {

        jwt.verify(token, process.env.SECRET, async (err, user) => {

            const userFound = await service.findOneId(user.id);  

            if (err) return res.status(401).json({ message: "El token no es válido" });

            if (userFound.user_admin) {

                next()
        
            }   else {
        
                return res.status(400).json({ message: "No eres administrador" })
        
            }

            });
    }

    catch (error) {

    }
}

module.exports = { verifyToken, verifyAdmin };
