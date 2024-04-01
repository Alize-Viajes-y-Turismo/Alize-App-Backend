// Importamos la clase DataTypes de Sequelize y Sequelize mismo
const { DataTypes, Sequelize } = require('sequelize');

// Exportamos una función que define el modelo de usuario
module.exports = (sequelize) => {
  // Definimos el modelo de usuario
  const User = sequelize.define('user', {
    // Definición de las columnas

    // Columna de identificación única del usuario
    id: {
      primaryKey: true,       // Es la clave primaria
      allowNull: false,       // No se permite que sea nulo
      autoIncrement: true,    // Se incrementa automáticamente
      type: DataTypes.INTEGER, // Tipo de datos: INTEGER
      unique: true            // Debe ser único
    },
    // Columna para el correo electrónico del usuario
    email: {
      type: DataTypes.STRING, // Tipo de datos: STRING
      unique: true            // Asegura que el email sea único
    },
    // Columna para la contraseña del usuario
    password: {
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para indicar si el usuario es administrador
    isAdmin: {
      type: DataTypes.BOOLEAN, // Tipo de datos: BOOLEAN
      defaultValue: false,     // Valor por defecto: falso (no es administrador)
    },
    // Columna para el PIN del usuario
    pin:{
      type: DataTypes.STRING, // Tipo de datos: STRING
    },
    // Columna para la fecha de creación del usuario
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

  // Definimos relaciones
  User.associate = (models) => {
    // Establecemos la relación de uno a muchos entre User y Passenger (un usuario puede tener varios pasajeros)
    User.hasMany(models.Passenger, { as: "passenger"});
    
  };

};