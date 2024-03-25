const { travel } = require("../db");

class TravelsServices {
    constructor () {}

    //ADMIN

    async find() {

        const res = await travel.findAll();
        return res;

    }

    async findOneId(id) {

        const res = await travel.findByPk(id,
        {attributes: ['id', 'email', 'isAdmin']})
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
            const res = await travel.create(data, {
                attributes: ['origin', 'destiny', 'date1', 'date2']
            })
            return res;
    

    }

    async update(data) {
        
        const res = await travel.update(data, {
            attributes: ['origin', 'destiny', 'date1', 'date2']
        })
        return res;

    }

}

module.exports = TravelsServices;
