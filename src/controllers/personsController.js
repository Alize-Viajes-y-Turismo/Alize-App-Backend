const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccesToken } = require("../libs/jwt.js"); 

const PersonsService = require("../services/usersService.js")
const service = new PersonsService();



const registerPerson = async (req, res) => {

    const { name, surname, dni, phone } = req.body;

    const idUser = req.user.id;

    try {

        const personNull = await service.findOneNull();

        //Verificar si el usuario ya existe
        
        if (personNull) {

            const newPerson = await nullPerson.service.update({ name, surname, dni, phone, idUser });

            return res.json({ success: true, data: newPerson });

        } else {

            const newPerson = await service.create({ name, surname, dni, phone, idUser })

            return res.json({ success: true, data: newPerson });

        };

    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
};

module.exports = { registerPerson };
