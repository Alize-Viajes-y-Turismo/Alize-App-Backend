
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const dotenv = require("dotenv");

// Obtén el puerto proporcionado por Railway desde las variables de entorno
const PORT = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ force: true }).then(() => { // Asegúrate de cambiar force a false para evitar la eliminación de datos
  dotenv.config();
  server.listen(PORT, () => { // Usa el puerto proporcionado por Railway
    console.log(`Server listening at port ${PORT}`); // Imprime el puerto en el que está escuchando el servidor
  });
});