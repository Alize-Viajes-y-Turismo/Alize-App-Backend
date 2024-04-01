// Importamos la clase DataTypes de Sequelize y Sequelize mismo
const { DataTypes, Sequelize } = require('sequelize');

// Exportamos una función que define el modelo de usuario
module.exports = (sequelize) => {
  
    // Definimos el modelo de Passenger
  const Passenger = sequelize.define('passenger', {
    // Definición de las columnas

    // Columna de identificación única del pasajero
    id: {
      allowNull: false,       // No se permite que sea nulo
      primaryKey: true,       // Es la clave primaria
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true,            // Debe ser único
      autoIncrement: true      // Se autoincrementa automáticamente
    },
    // Columna para el nombre del pasajero
    name: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el apellido del pasajero
    surname: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el DNI (Documento Nacional de Identidad) del pasajero
    dni: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el teléfono del pasajero
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
      type: DataTypes.BOOLEAN// Tipo de datos: BOOLEAN    
    },
    // Clave foránea que vincula este pasajero con un usuario en otra tabla
    userId: {
      allowNull: false,       // No se permite que sea nulo
      foreignKey: true,       // Indica que es una clave foránea
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true            // Debe ser único
    },

    // Clave foránea que vincula este pasajero con un viaje en otra tabla
    travelId: {
      allowNull: false,       // No se permite que sea nulo
      foreignKey: true,       // Indica que es una clave foránea
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true            // Debe ser único
    },
    // Columna para la fecha de creación del pasajero
    createdAt: {
      type: DataTypes.DATE,   // Tipo de datos: DATE
      allowNull: false,       // No se permite que sea nulo
      // Establece el valor por defecto como la fecha y hora actual
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    // Columna para la fecha de actualización del pasajero
    updatedAt: {
      type: DataTypes.DATE,   // Tipo de datos: DATE
      allowNull: false,       // No se permite que sea nulo
      // Establece el valor por defecto como la fecha y hora actual
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }

  });

  // Definimos relaciones
  Passenger.associate = (models) => {
    // Establecemos la relación de pertenencia entre Passenger y User
    Passenger.belongsTo(models.User, { foreignKey: 'userId' });

    // Establecemos la relación de pertenencia entre Passenger y Travel
    Passenger.belongsTo(models.Travel, { foreignKey: 'travelId' });
    
  };

};
