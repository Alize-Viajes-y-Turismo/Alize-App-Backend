// Importamos la clase DataTypes de Sequelize
const { DataTypes, Sequelize } = require('sequelize');

// Exportamos una función que define el modelo de usuario
module.exports = (sequelize) => {
  
    // Definimos el modelo de Person
  const Travel = sequelize.define('Travel', {
    // Definición de las columnas

    // Columna de identificación única de la persona
    id: {
      allowNull: false,       // No se permite que sea nulo
      primaryKey: true,       // Es la clave primaria
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true            // Debe ser único
    },
    // Columna para el nombre de la persona
    origin: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el apellido de la persona
    destiny: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    date1: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el teléfono de la persona
    date2: {
      type: DataTypes.STRING // Tipo de datos: STRING
    },
    // Columna para el DNI (Documento Nacional de Identidad) de la persona
  });

  Travel.associate = (models) => {
    Travel.hasMany(models.Passenger, { as: "passenger"});
  };

};