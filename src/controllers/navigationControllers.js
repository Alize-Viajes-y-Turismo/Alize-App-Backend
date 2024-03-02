const jwt = require("jsonwebtoken");
const UsersService = require("../services/usersService.js");
const service = new UsersService();

const verifyTokenNavigation = async (req, res, next) => {

    const { token } = req.body;

    if (!token) {

        return res.status(400).json({ message: "No hay token"} );
    
    } else {

    jwt.verify(token, process.env.SECRET, async (err, user) => {

        if (err) return res.status(401).json({ message: "El token no es válido" });
        
        const userFound = await service.findOneId(user.id); 
            
        if (!userFound) return res.status(401).json({ message: "No se encontró el usuario" });

        res.json( {data: {

            id: userFound.id,
            email: userFound.email

        }});

        })

    }
}

module.exports = { verifyTokenNavigation };