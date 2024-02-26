const { User } = require("../db");

class UsersService {
    constructor () {}

    //ADMIN

    async find() {

        const res = await User.findAll();
        return res;

    }

    async findOneId(id) {

        const res = await User.findByPk(id);
        return res;

    }

    async findOneEmail(email) {

        const res = await User.findOne({ where: { email } });
        return res;

    };

    async findOneToken(Token) {

        const res = await User.findOne({ where: { Token } });
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
