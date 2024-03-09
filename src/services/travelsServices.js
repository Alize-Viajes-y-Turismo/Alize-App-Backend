const { Travel } = require("../db");

class TravelsServices {
    constructor () {}

    //ADMIN

    async find() {

        const res = await Travel.findAll();
        return res;

    }

    async findOneId(id) {

        const res = await Travel.findByPk(id);
        return res;

    }

    async findOneNull() {

        const res = await Passenger.findOne({ where: { name: null, surname: null, dni: null, phone: null, userId: null } }, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    };

    //USER

    async create(data) {

        const res = await Travel.create(data);
        return res;

    }

    async update(data) {

        const res = await Travel.update(data);
        return res;

    }

}

module.exports = TravelsServices;
