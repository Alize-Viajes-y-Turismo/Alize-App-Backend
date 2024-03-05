const { Passenger } = require("../db");

class PassengersService {
    constructor () {}

    async find() {

        const res = await Passenger.findAll({
            attributes: ['id', 'name', 'surname', "dni", "phone", "return", "seatType", "wayToPay"]
        });
        return res;

    }

    async findOneId(id) {

        const res = await Passenger.findByPk(id, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    }

    async findOneNull() {

        const res = await Passenger.findOne({ where: { name: null, surname: null, dni: null, phone: null, userId: null } }, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    };

    async create(data) {

        const res = await Passenger.create(data, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    }

    async update(data) {

        const res = await Passenger.update(data, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    }

}

module.exports = PassengersService;
