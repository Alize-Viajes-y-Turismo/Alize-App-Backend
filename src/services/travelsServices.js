const { travel } = require("../db");

class TravelsServices {
    constructor () {}

    // Métodos para operaciones de administrador

    // Método para encontrar todos los viajes
    async find() {
        const res = await travel.findAll();
        return res;
    }

    // Método para encontrar un viaje por su ID
    async findOneId(id) {
        const res = await travel.findByPk(id, {
            attributes: ['id', 'origin', 'destiny', 'date1', 'date2']
        });
        return res;
    }

    // Método para encontrar un viaje con valores nulos
    async findOneNull() {
        const res = await Passenger.findOne({ 
            where: { 
                name: null, 
                surname: null, 
                dni: null, 
                phone: null, 
                userId: null 
            }, 
            attributes: ['id', 'origin', 'destiny', 'date1', 'date2'] 
        });
        return res;
    };

    // Métodos para operaciones de usuario

    // Método para crear un nuevo viaje
    async create(data) {
        const res = await travel.create(data, {
            attributes: ['origin', 'destiny', 'date1', 'date2']
        });
        return res;
    }

    // Método para actualizar un viaje existente
    async update(data) {
        const res = await travel.update(data, {
            attributes: ['origin', 'destiny', 'date1', 'date2']
        });
        return res;
    }
}

module.exports = TravelsServices;
