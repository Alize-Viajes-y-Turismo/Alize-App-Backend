// Importamos la clase DataTypes de Sequelize
const { DataTypes, Sequelize } = require('sequelize');

// Exportamos una función que define el modelo de usuario
module.exports = (sequelize) => {
  // Definimos el modelo de usuario
  const User = sequelize.define('User', {
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
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

  //Relaciones

  User.associate = (models) => {
    User.hasMany(models.Passenger, { as: "passenger"});
  };


  // Definimos el modelo de usuario
  const UserPassword = sequelize.define('UserPassword', {

  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    field: 'is_used',
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'tb_user_password',
  modelName: 'UserPassword'
});

User.hasMany(UserPassword, {
  foreignKey: 'user_id'
});

};