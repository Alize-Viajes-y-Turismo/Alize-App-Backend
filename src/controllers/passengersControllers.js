const PassengersService = require("../services/passengersService.js")
const service = new PassengersService();



const registerPassenger = async (req, res) => {

    const { name, surname, dni, phone, returnOrigin, seatType, wayToPay, travelId } = req.body;

    const userId = req.user.id;

    try {

        const passengerNull = await service.findOneNull();

        //Verificar si el usuario ya existe
        
        if (passengerNull) {

            const newPassenger = await passengerNull.service.update({ name, surname, dni, phone, returnOrigin, seatType, wayToPay, userId, travelId });

            return res.json({ success: true, data: newPassenger });

        } else {

            const newPassenger = await service.create({ name, surname, dni, phone, returnOrigin, seatType, wayToPay, userId, travelId })

            return res.json({ success: true, data: newPassenger });

        };

    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
};

const deletePassenger = async (req, res) => {

    //CONSULTAR SI TAMBIÉN ELIMINARÁ LOS PASAJES TOMADOS. EN CASO DE QUE EL PASAJE NO SE PUEDA ELIMINAR POR FUERA DE TÉRMINO QUE SE HARÁ.

    const email = req.user.email;

    try {
    
        const user = await service.findOneEmail(email);

        if (user) {

            await user.update({ email: null, password: null});
            return res.json({ message: "Cuenta eliminada correctamente" });
        
        }
        else {

            return res.status(400).json({ message: "El usuario no existe" });

        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message });

    }
};

module.exports = { registerPassenger };
