const { Travel } = require("../db");

const registerTravel = async (req, res) => {
    const { origin, destiny, date1, date2 } = req.body;

    try {
        // Crear un nuevo viaje
        const newTravel = await Travel.create({ origin, destiny, date1, date2 });

        // Verificar si se creó correctamente el viaje
        if (newTravel) {
            console.log("Nuevo viaje creado:", newTravel);
            return res.json({ success: true, data: newTravel });
        } else {
            // Devolver un mensaje de error si no se creó el viaje correctamente
            return res.status(500).json({ success: false, message: "No se pudo crear el nuevo viaje" });
        }
    } catch (error) {
        // Manejar errores de servidor devolviendo un mensaje de error detallado
        console.error("Error al registrar el viaje:", error);
        return res.status(500).json({ success: false, message: "Se produjo un error al registrar el viaje", error: error.message });
    }
};

const deleteTravel = async (req, res) => {
    const { id } = req.body;

    try {
        // Buscar el viaje por su ID
        const travel = await Travel.findByPk(id);0

        if (travel) {
            // Eliminar el viaje encontrado
            await travel.destroy();
            return res.json({ success: true, message: "Viaje eliminado correctamente" });
        } else {
            // Devolver un código de estado 404 si el viaje no se encuentra
            return res.status(404).json({ success: false, message: "El viaje no existe" });
        }
    } catch (error) {
        // Devolver un código de estado 500 si ocurre un error del servidor
        return res.status(500).json({ success: false, message: "Se produjo un error al eliminar el viaje" });
    }
};

const travels = async (req, res) => {
    try {
        // Obtener todos los viajes de la base de datos
        const allTravels = await Travel.findAll();
        
        // Enviar los viajes al cliente
        return res.json({ success: true, travels: allTravels });
    } catch (error) {
        // Devolver un mensaje de error en caso de un error del servidor
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { registerTravel, deleteTravel, travels};