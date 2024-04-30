const jwt = require("jsonwebtoken");
const UsersServices = require("../services/usersServices.js")
const service = new UsersServices();
const { Passenger, User } = require("../db");

//User

const getUsers = async (req, res) => {
    const { id } = req.params; // asumiendo que estás obteniendo el id de los parámetros de la solicitud
    try {
        const user = await service.findOneId(id);

        // Verificar si el usuario existe y si es un administrador
        if (user && user.isAdmin == true) {
            // Suponiendo que tienes una función en tu servicio para buscar usuarios con algún tipo de filtro
            const usersFound = await service.find({ isAdmin: false }); // Por ejemplo, aquí estoy filtrando para excluir a los administradores
            return res.status(200).json({ 
                success: true, 
                users: usersFound 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "El usuario no está autorizado para realizar esta acción" 
            });
        }
    } catch (error) {
        console.error("Error al recuperar usuarios:", error);
        return res.status(500).json({
            success: false, 
            message: "Se produjo un error al recuperar los usuarios" 
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar usuario por ID
        const userFound = await service.findOneId(id);
        if (!userFound) {
            return res.status(400).json({ 
                success: false,
                message: "El usuario no existe" 
            });
        }

        // Eliminar usuario de la base de datos
        await User.destroy({ where: { id: id } });

        return res.json({ 
            success: true, 
            message: "Usuario eliminado correctamente" 
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Ocurrió un error al eliminar el usuario" 
        });
    }
};


const getPassenger = async (req, res) => {
    const { id } = req.params; // asumiendo que estás obteniendo el id de los parámetros de la solicitud
    try {
        const user = await service.findOneId(id);

        // Verificar si el usuario existe y si es un administrador
        if (user && user.isAdmin === true) {
            // Suponiendo que tienes una condición para encontrar al pasajero relevante, por ejemplo, por id de usuario
            const passengerFound = await Passenger.findOne();
            if (passengerFound) {
                return res.status(200).json({ 
                    success: true, 
                    passenger: passengerFound 
                });
            } else {
                return res.status(404).json({ 
                    success: false, 
                    message: "Pasajero no encontrado" 
                });
            }
        } else {
            return res.status(403).json({ 
                success: false,
                message: "El usuario no está autorizado para realizar esta acción" 
            });
        }
    } catch (error) {
        console.error("Error al recuperar el pasajero:", error);
        return res.status(500).json({ 
            success: false,
            message: "Se produjo un error al recuperar los detalles del pasajero" 
            });
    }
};


const deletePassenger = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar pasajero por ID
        const passengerFound = await Passenger.findByPk(id);
        if (!passengerFound) {
            return res.status(400).json({ 
                success: false, 
                message: "El pasajero no existe" 
            });
        }

        // Eliminar pasajero de la base de datos
        await Passenger.destroy({ where: { id: id } });
        return res.json({ 
            success: true, 
            message: "Pasajero eliminado correctamente" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const createAdmin = async (req, res) => {
    const { id } = req.body;
    try {
        const userFound = await service.findOneId(id);

        if(userFound) {
            // Actualizamos el rol del usuario a administrador
            userFound.isAdmin = true;

            // Guardamos los cambios del usuario en la base de datos
            await userFound.save();

            res.status(200).json({ 
                success: true, 
                message: "El usuario ahora es un administrador" 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: "Usuario no encontrado" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


const passengerPay = async (req, res) => {
    const { id } = req.body;
    try {
        const passengerFound = await Passenger.findByPk(id);

        if(passengerFound) {
            // Actualizamos el estado de pago del pasajero a true
            passengerFound.wayToPay = true;

            // Guardamos los cambios del pasajero en la base de datos
            await passengerFound.save();

            res.status(200).json({ 
                success: true, 
                message: "El pasajero ha pagado su boleto" 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: "Pasajero no encontrado" 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message 
            });
    }
};

module.exports = { getUsers, deleteUser, getPassenger, deletePassenger, createAdmin, passengerPay };