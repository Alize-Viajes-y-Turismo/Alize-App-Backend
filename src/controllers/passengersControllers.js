const PassengersService = require("../services/passengersService.js")
const service = new PassengersService();



const registerPassenger = async (req, res) => {

    const { name, surname, dni, phone } = req.body;

    const userId = req.user.id;

    try {

        const passengerNull = await service.findOneNull();

        //Verificar si el usuario ya existe
        
        if (passengerNull) {

            const newPassenger = await passengerNull.service.update({ name, surname, dni, phone, userId });

            return res.json({ success: true, data: newPassenger });

        } else {

            const newPassenger = await service.create({ name, surname, dni, phone, userId })

            return res.json({ success: true, data: newPassenger });

        };

    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
};

module.exports = { registerPassenger };
