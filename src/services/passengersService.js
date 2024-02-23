const { Passenger } = require("../db");

class PassengersService {
    constructor () {}

    //ADMIN

    async find() {

        const res = await Passenger.findAll();
        return res;

    }

    async findOneId(id) {

        const res = await Passenger.findByPk(id);
        return res;

    }

    async findOneNull() {

        const res = await Passenger.findOne({ where: { name: null, surname: null, dni: null, phone: null, userId: null } });
        return res;

    };


    //USER

    async create(data) {

        const res = await Passenger.create(data);
        return res;

    }

    async update(data) {

        const res = await Passenger.update(data);
        return res;

    }

}

module.exports = PassengersService;
