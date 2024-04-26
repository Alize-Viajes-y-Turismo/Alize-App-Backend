// Importamos la clase DataTypes de Sequelize
const { DataTypes, Sequelize } = require('sequelize');

// Exportamos una función que define el modelo de usuario
module.exports = (sequelize) => {
  
    // Definimos el modelo de Person
  const Passenger = sequelize.define('Passenger', {
    // Definición de las columnas

    // Columna de identificación única de la persona
    id: {
      allowNull: false,       // No se permite que sea nulo
      primaryKey: true,       // Es la clave primaria
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true,            // Debe ser único
      autoIncrement: true
    },
    // Columna para el nombre de la persona
    name: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el apellido de la persona
    surname: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el DNI (Documento Nacional de Identidad) de la persona
    dni: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el teléfono de la persona
    phone: {
      type: DataTypes.STRING // Tipo de datos: STRING
    },
    // Columna para indicar si el pasajero tiene billete de ida y vuelta
    returnOrigin: {
      type: DataTypes.BOOLEAN// Tipo de datos: BOOLEAN
    },
    // Columna para el tipo de asiento reservado por el pasajero
    seatType: {
      type: DataTypes.STRING // Tipo de datos: STRING
    },
    // Columna para la forma de pago elegida por el pasajero
    wayToPay: {
      type: DataTypes.STRING // Tipo de datos: STRING
    },
    // Clave foránea que vincula este pasajero con un usuario en otra tabla
    userId: {
      allowNull: false,       // No se permite que sea nulo
      foreignKey: true,       // Indica que es una clave foránea
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
    },

    travelId: {
      allowNull: false,       // No se permite que sea nulo
      foreignKey: true,       // Indica que es una clave foránea
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,   // Tipo de datos: DATE
      allowNull: false,       // No se permite que sea nulo
      // Establece el valor por defecto como la fecha y hora actual
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    // Columna para la fecha de actualización del usuario
    updatedAt: {
      type: DataTypes.DATE,   // Tipo de datos: DATE
      allowNull: false,       // No se permite que sea nulo
      // Establece el valor por defecto como la fecha y hora actual
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }

  });

  Passenger.associate = (models) => {

    // Define la relación con el modelo User
    Passenger.belongsTo(models.User, { foreignKey: 'userId' });

    // Define la relación con el modelo Travel
    Passenger.belongsTo(models.Travel, { foreignKey: 'travelId' });
 };

  return Passenger;

};
