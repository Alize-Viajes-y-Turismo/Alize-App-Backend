const { Travel } = require("../db");
const { User } = require("../db");


const registerTravel = async (req, res) => {
    const { origin, destiny, date1, date2 } = req.body;
    const id = req.params.id;

    try {
        const user = await User.findByPk(id);

        // Check if user exists and if the user is an admin
        if (user && user.isAdmin === true) {
            const newTravel = await Travel.create({ origin: origin, destiny: destiny, date1: date1, date2: date2 });
          
          console.log(newTravel)
            return res.json({ success: true, data: newTravel });
        } else {
            return res.status(403).json({ message: "You are not an admin" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteTravel = async (req, res) => {


    const id = req.params.id; 

    try {
    
        const travel = await Travel.findByPk(id);

        if (travel) {

            await travel.destroy();
            return res.json({ message: "Viaje eliminado correctamente" });
        
        }
        else {

            return res.status(400).json({ message: "Algo salio mal" });

        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message });

    }
};

const travels = async (req, res) => {
    try {
        const allTravels = await Travel.findAll();
        return res.json(allTravels); // Enviar los viajes al cliente
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { registerTravel, deleteTravel, travels};
