const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PassengersService = require("../services/usersService.js")
const service = new PassengersService();



const registerPassenger = async (req, res) => {

    const { name, surname, dni, phone } = req.body;

    const idUser = req.user.id;

    try {

        const passengerNull = await service.findOneNull();

        //Verificar si el usuario ya existe
        
        if (passengerNull) {

            const newPassenger = await passengerNull.service.update({ name, surname, dni, phone, idUser });

            return res.json({ success: true, data: newPassenger });

        } else {

            const newPassenger = await service.create({ name, surname, dni, phone, idUser })

            return res.json({ success: true, data: newPassenger });

        };

    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
};

module.exports = { registerPassenger };
