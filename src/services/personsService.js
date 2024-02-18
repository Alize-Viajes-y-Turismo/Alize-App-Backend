const { models } = require("../db");

class PersonsService {
    constructor () {}

    async find() {

        const res = await models.Person.findAll();
        return res;

    }

    async findOne(id) {

        const res = await models.Person.findByPk(id);
        return res;

    }

    async create(data) {

        const model = await this.findOne({
                // Opciones de búsqueda
            where: {
                    // Utiliza la operación "OR" para buscar registros que cumplan con al menos una de las condiciones
                [Sequelize.Op.or]: [
                        // Condición: campo email es null
                    { email: null },
                        // Condición: campo password es null
                    { password: null }
                        // Puedes agregar más condiciones aquí si necesitas buscar otros campos que puedan ser null
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

