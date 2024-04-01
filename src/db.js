require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const { Sequelize } = require('sequelize'); // Importa la clase Sequelize de la librería sequelize
const fs = require('fs'); // Módulo para trabajar con el sistema de archivos
const path = require('path'); // Módulo para trabajar con rutas de archivos
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename); // Obtiene el nombre del archivo actual

const modelDefiners = []; // Arreglo para almacenar las funciones de definición de modelos

// Lee todos los archivos de la carpeta "models" y los agrega al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injecta la conexión Sequelize a todos los modelos
modelDefiners.forEach(model => model(sequelize));

// Capitaliza los nombres de los modelos (p.ej., product => Product)
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// Exporta los modelos y la conexión a la base de datos
module.exports = {
  ...sequelize.models, // Permite importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // Permite importar la conexión así: { conn } = require('./db.js');
};