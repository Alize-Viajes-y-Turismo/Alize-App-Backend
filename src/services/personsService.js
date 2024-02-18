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

    async findOneEmail(email) {

        const res = await User.findOne({ where: { email } });
        return res;

    };

    async findOneNull() {

        const res = await User.findOne({ where: { email: null, password: null } });
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
