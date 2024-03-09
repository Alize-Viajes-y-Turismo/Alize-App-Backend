const jwt = require("jsonwebtoken");
const UsersServices = require("../services/usersServices.js")
const service = new UsersServices();

//User

const getUsers = async (req, res) => {

    try {

        const usersFound = await service.find();
        res.status(200).json({ usersFound });

    }
    catch {

        res.status(404).json({ message: error.message })

    }

};


const deleteUser = async (req, res) => {

    const id = req.body.id;

    try {
        // Buscar usuario por correo electrónico
        const userFound = await service.findOneId(id);
        if (!userFound) {
            return res.status(400).json({ message: "El usuario no existe" });
        }

        // Eliminar usuario de la base de datos
        await user.update({ email: null, password: null});
        return res.json({ message: "Usuario eliminado correctamente" });

    } catch (error) {

        return res.status(500).json({ message: error.message });

    }

};

//Travel


const getTravels = async (req, res) => {


};

const deleteTravel = async (req, res) => {


};

//Passenger

const getPassengers = async (req, res) => {


};

const getPassenger = async (req, res) => {


};

const deletePassenger = async (req, res) => {


};