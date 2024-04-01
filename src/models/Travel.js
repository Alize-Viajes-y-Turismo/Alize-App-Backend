// Importamos la clase DataTypes de Sequelize y Sequelize mismo
const { DataTypes, Sequelize } = require('sequelize');

// Exportamos una función que define el modelo de viaje
module.exports = (sequelize) => {
  
    // Definimos el modelo de Travel
  const Travel = sequelize.define('travel', {
    // Definición de las columnas

    // Columna de identificación única del viaje
    id: {
      allowNull: false,       // No se permite que sea nulo
      primaryKey: true,       // Es la clave primaria
      autoIncrement: true,    // Se incrementa automáticamente
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true            // Debe ser único
    },
    // Columna para el origen del viaje
    origin: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para el destino del viaje
    destiny: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para la primera fecha asociada al viaje
    date1: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para la segunda fecha asociada al viaje
    date2: {
      type: DataTypes.STRING // Tipo de datos: STRING
    },
    // Columna para la fecha de creación del viaje
    createdAt: {
      type: DataTypes.DATE,   // Tipo de datos: DATE
      allowNull: false,       // No se permite que sea nulo
      // Establece el valor por defecto como la fecha y hora actual
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    // Columna para la fecha de actualización del viaje
    updatedAt: {
      type: DataTypes.DATE,   // Tipo de datos: DATE
      allowNull: false,       // No se permite que sea nulo
      // Establece el valor por defecto como la fecha y hora actual
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Definimos relaciones
  Travel.associate = (models) => {
    // Establecemos la relación de uno a muchos entre Travel y Passenger (un viaje puede tener varios pasajeros)
    Travel.hasMany(models.Passenger, { as: "passenger"});
    
  };

};