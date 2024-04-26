const { Passenger } = require("../db");

const registerPassenger = async (req, res) => {
    const { name, surname, dni, phone, returnOrigin, seatType, wayToPay, travelId } = req.body;
    const userId = req.user.id; // Obtener el userId del req.user

    try {
        // Verificar si ya existe un pasajero con el mismo DNI en el mismo viaje
        const existingPassenger = await Passenger.findOne({ where: { dni, travelId } });
        
        if (existingPassenger) {
            // Si ya existe un pasajero con el mismo DNI en el mismo viaje, no se crea uno nuevo
            return res.status(400).json({ success: false, message: "Ya existe un pasajero con el mismo DNI en este viaje" });
        }

        // Buscar un pasajero con todas las propiedades null
        const passengerNull = await Passenger.findOne({ 
            where: { 
                name: null, 
                surname: null, 
                dni: null, 
                phone: null, 
                returnOrigin: null, 
                seatType: null, 
                wayToPay: null, 
                travelId: null, 
                userId: null 
            } 
        });
        
        if (passengerNull) {
            // Si se encuentra un pasajero con todas las propiedades null, actualizar sus datos
            await passengerNull.update({ 
                name, 
                surname, 
                phone, 
                returnOrigin, 
                seatType, 
                wayToPay,
                userId,  
                travelId
            });
            
            return res.json({ success: true, message: "Se han actualizado los datos del pasajero existente con todas las propiedades null" });
        } else {
            // Si no se encuentra un pasajero con todas las propiedades null, crear uno nuevo
            const newPassenger = await Passenger.create({ 
                name, 
                surname, 
                dni, 
                phone, 
                returnOrigin, 
                seatType, 
                wayToPay,
                userId,  
                travelId
            });
    
            return res.json({ success: true, message: "Se ha registrado un nuevo pasajero", data: newPassenger });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deletePassenger = async (req, res) => {
    const { passengerId } = req.body;

    try {
        const existingPassenger = await Passenger.findByPk(passengerId);

        if (existingPassenger) {
            // Poner en null las propiedades del usuario asociado al pasajero
            await existingPassenger.update({ userId: null });
            await existingPassenger.setTravel(null); // Si también deseas poner en null la propiedad de viaje

            return res.json({ 
                success: true, 
                message: "Las propiedades del usuario asociado al pasajero han sido puestas en null" 
            });
        } else {
            return res.json({ 
                success: false, 
                message: "El pasajero no existe" 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Error al actualizar las propiedades del usuario asociado al pasajero",
            error: error.message 
        });
    }
};

const getUserPassengers = async (req, res) => {
    try {
        const userId = req.user.id; // Obtener el userId del req.user
        const passengers = await Passenger.findAll({ where: { userId } });
        return res.json({ success: true, passengers: passengers });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al obtener los pasajeros del usuario", error: error.message });
    }
};

module.exports = { registerPassenger, deletePassenger, getUserPassengers };