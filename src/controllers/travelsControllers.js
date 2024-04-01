const { Travel } = require("../db");
const { User } = require("../db");


const registerTravel = async (req, res) => {
    const { origin, destiny, date1, date2 } = req.body;
    const id = req.params.id;

    try {
        // Buscar al usuario por su ID
        const user = await User.findByPk(id);

        // Verificar si el usuario existe y si es un administrador
        if (user && user.isAdmin === true) {
            // Crear un nuevo viaje
            const newTravel = await Travel.create({ origin, destiny, date1, date2 });
            console.log(newTravel);
            return res.json({ success: true, data: newTravel });
        } else {
            // Devolver un mensaje de error si el usuario no es un administrador
            return res.status(403).json({ message: "No tienes permisos de administrador para realizar esta acción" });
        }
    } catch (error) {
        // Manejar errores de servidor devolviendo un mensaje de error
        return res.status(500).json({ message: "Se produjo un error al registrar el viaje" });
    }
};

const deleteTravel = async (req, res) => {
    const id = req.params.id;

    try {
        // Buscar el viaje por su ID
        const travel = await Travel.findByPk(id);

        if (travel) {
            // Eliminar el viaje encontrado
            await travel.destroy();
            return res.json({ message: "Viaje eliminado correctamente" });
        } else {
            // Devolver un código de estado 404 si el viaje no se encuentra
            return res.status(404).json({ message: "El viaje no existe" });
        }
    } catch (error) {
        // Devolver un código de estado 500 si ocurre un error del servidor
        return res.status(500).json({ message: "Se produjo un error al eliminar el viaje" });
    }
};

const travels = async (req, res) => {
    try {
        // Obtener todos los viajes de la base de datos
        const allTravels = await Travel.findAll();
        
        // Enviar los viajes al cliente
        return res.json({ travels: allTravels });
    } catch (error) {
        // Devolver un mensaje de error en caso de un error del servidor
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { registerTravel, deleteTravel, travels};
