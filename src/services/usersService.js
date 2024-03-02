const { User } = require("../db");

class UsersService {
    constructor () {}

    //ADMIN

    async find() {

        const res = await User.findAll({
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    }

    async findOneId(id) {

        const res = await User.findByPk(id, {
            attributes: ['id', 'email', 'isAdmin', 'password']
        });
        return res;

    }

    async findOneEmail(email) {

        const res = await User.findOne({ where: { email } }, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    };

    async findOneNull() {

        const res = await User.findOne({ where: { email: null, password: null } }, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    };


    //USER

    async create(data) {

        const res = await User.create(data, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    }

    async update(data) {

        const res = await User.update(data, {
            attributes: ['id', 'email', 'isAdmin']
        });
        return res;

    }

}

module.exports = UsersService;
