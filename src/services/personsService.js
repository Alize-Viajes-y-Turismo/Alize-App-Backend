const { Person } = require("../db");

class PersonsService {
    constructor () {}

    //ADMIN

    async find() {

        const res = await Person.findAll();
        return res;

    }

    async findOneId(id) {

        const res = await Person.findByPk(id);
        return res;

    }

    async findOneNull() {

        const res = await User.findOne({ where: { name: null, surname: null, dni: null, phone: null, idUser: null } });
        return res;

    };


    //USER

    async create(data) {

        const res = await User.create(data);
        return res;

    }

    async update(data) {

        const res = await User.update(data);
        return res;

    }

}

module.exports = UsersService;
