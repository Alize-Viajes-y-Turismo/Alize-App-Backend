const PassengersServices = require("../services/passengersServices.js");
const service = new PassengersServices();


const registerPassenger = async (req, res) => {
    const { name, surname, dni, phone, returnOrigin, seatType, wayToPay } = req.body;

    // Obtener userId del usuario autenticado
    const userId = req.user.id;

    // Obtener travelId de los datos de la solicitud (por ejemplo, desde req.body o req.params)
    const { travelId } = req.body;

    try {
        const passengerNull = await service.findOneNull();

        if (passengerNull) {
            const newPassenger = await passengerNull.update({ name, surname, dni, phone, returnOrigin, seatType, wayToPay, userId, travelId });
            return res.json({ success: true, data: newPassenger });
        } else {
            const newPassenger = await service.create({ name, surname, dni, phone, returnOrigin, seatType, wayToPay, userId, travelId });
            return res.json({ success: true, data: newPassenger });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deletePassenger = async (req, res) => {
    const id = req.params.id; // Obtener el ID del pasajero desde los parámetros de la ruta

    try {
        // Buscar el pasajero por su ID
        const passenger = await service.findOneId(id);

        if (passenger) {
            // Eliminar el pasajero encontrado
            await passenger.destroy({
                where: {
                    id: id // Especificar la condición para eliminar el pasajero por su ID
                }
            });
            return res.json({ message: "Pasajero eliminado correctamente" });
        } else {
            return res.status(404).json({ message: "El pasajero no existe" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { registerPassenger, deletePassenger };
