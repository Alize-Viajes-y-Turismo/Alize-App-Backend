const { User } = require("../db");

class UsersService {
    constructor () {}

    // Métodos para operaciones de administrador

    // Método para encontrar todos los usuarios
    async find() {
        const res = await User.findAll(); // Busca todos los usuarios en la base de datos
        return res;
    }

    // Método para encontrar un usuario por su ID
    async findOneId(id) {
        const res = await User.findByPk(id, {
            attributes: ['id', 'email', 'isAdmin', 'password'] // Devuelve solo los atributos específicos del usuario
        });
        return res;
    }

    // Método para encontrar un usuario por su dirección de correo electrónico
    async findOneEmail(email) {
        const res = await User.findOne({ where: { email } }, {
            attributes: ['id', 'email', 'isAdmin'] // Devuelve solo los atributos específicos del usuario
        });
        return res;
    }

    // Método para encontrar un usuario por su token de restablecimiento de contraseña
    async findOneToken(Token) {
        const res = await User.findOne({ where: { resetPasswordToken: Token } }); // Busca un usuario por su token de restablecimiento de contraseña
        return res;
    }

    // Método para encontrar un usuario por su código de verificación (PIN)
    async findOnePin(Code) {
        const res = await User.findOne({ where: { pin: Code } }); // Busca un usuario por su código de verificación
        return res;
    }

    // Método para encontrar un usuario con valores nulos en sus campos
    async findOneNull() {
        const res = await User.findOne({ where: { email: null, password: null } }, {
            attributes: ['id', 'email', 'isAdmin'] // Devuelve solo los atributos específicos del usuario
        });
        return res;
    }

    // Métodos para operaciones de usuario

    // Método para crear un nuevo usuario
    async create(data) {
        const res = await User.create(data, {
            attributes: ['id', 'email', 'isAdmin'] // Crea un nuevo usuario con los datos proporcionados y devuelve solo los atributos específicos del usuario
        });
        return res;
    }

    // Método para actualizar un usuario existente
    async update(data) {
        const res = await User.update(data, {
            attributes: ['id', 'email', 'isAdmin'] // Actualiza un usuario con los datos proporcionados y devuelve solo los atributos específicos del usuario
        });
        return res;
    }
}


module.exports = UsersService;
