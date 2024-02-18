const { models } = require("../db");

class UsersService {
    constructor () {}

    //ADMIN

    async find() {

        const res = await models.Person.findAll();
        return res;

    }

    async findOneId(id) {

        const res = await models.Person.findByPk(id);
        return res;

    }

    async findOneName(name) {

        const res = await models.Person.findOne({ where: { name } });
        return res;

    };

    async findOneNull() {

        const res = await models.Person.findOne({ where: { name: null, password: null } });
        return res;

    };


    //USER

    async create(data) {

        const model = await this.findOne({
            // Opciones de búsqueda
            where: {
                // Utiliza la operación "OR" para buscar registros que cumplan con al menos una de las condiciones
                [Sequelize.Op.and]: [
                    // Condición: campo email es null
                    { name: null},
                        // Condición: campo password es null
                    { surname: null },
                        // Puedes agregar más condiciones aquí si necesitas buscar otros campos que puedan ser null
                    { dni: null },
                    { phone: null }
                ]
            }
        });
            if (model) {

                const res = await model.update(data);
                return res;

            }
            else {

                const res = await model.create(data);
                return res;

            }
    }

    async update(id, data) {

        const model = await this.findOne(id);
        const res = await model.update(data);
        return res;

    }

}
