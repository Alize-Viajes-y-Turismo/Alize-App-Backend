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
    dni: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el teléfono de la persona
    phone: {
      type: DataTypes.STRING // Tipo de datos: STRING
    },
    // Columna para el DNI (Documento Nacional de Identidad) de la persona
    userId: {
      allowNull: false,       // No se permite que sea nulo
      foreignKey: true, 
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true  
    }

  });

  //Relaciones
  Passenger.associate = (models) => {
    Passenger.belongsTo(models.User, { foreignKey: 'userId' });
    
  };
};