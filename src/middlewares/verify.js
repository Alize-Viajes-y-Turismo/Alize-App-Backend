const jwt = require("jsonwebtoken");

const usersService = require("../services/usersService.js")
const service = new usersService();

const verifyToken = async (req, res) => {
    const {token} = req.cookies

    if (!token) return res.status(401).json({ message: "No hay token"} );

    jwt.verify(token, process.env.SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "El token no es válido" });

    const userFound = await service.findOneId(id);;  
    
    if (!userFound) return res.status(401).json({ message: "No se encontró el usuario" });
    
    return req.user = userFound;
    })
}