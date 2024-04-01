const { Passenger } = require("../db");

class PassengersService {
    constructor () {}

    // Método para encontrar todos los pasajeros en la base de datos
    async find() {
        const res = await Passenger.findAll({
            attributes: ['id', 'name', 'surname', 'dni', 'phone', 'return', 'seatType', 'wayToPay'] // Selecciona los atributos específicos a devolver
        });
        return res;
    }

    // Método para encontrar un pasajero por su ID
    async findOneId(id) {
        const res = await Passenger.findByPk(id, {
            attributes: ['id'] // Solo devuelve el ID del pasajero
        });
        return res;
    }

    // Método para encontrar un pasajero con campos nulos
    async findOneNull() {
        const res = await Passenger.findOne({ 
            where: { 
                name: null, 
                surname: null, 
                dni: null, 
                phone: null, 
                userId: null 
            }, // Filtra los pasajeros con campos nulos en ciertos campos
            attributes: ['id', 'userId', 'travelId'] // Selecciona los atributos específicos a devolver
        });
        return res;
    };

    // Método para crear un nuevo pasajero en la base de datos
    async create(data) {
        const res = await Passenger.create(data); // Crea un nuevo pasajero con los datos proporcionados
        return res;
    }

    // Método para actualizar un pasajero en la base de datos
    async update(data) {
        const res = await Passenger.update(data); // Actualiza un pasajero con los datos proporcionados
        return res;
    }
}

module.exports = PassengersService;
