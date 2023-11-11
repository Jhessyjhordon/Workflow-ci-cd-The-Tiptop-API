const { Sequelize } = require('sequelize');
require('dotenv').config(); // Assurez-vous d'avoir un fichier .env.test pour les variables spécifiques aux tests

const sequelizeTest = new Sequelize(
  process.env.MYSQL_TEST_DATABASE,
  process.env.MYSQL_TEST_USER,
  process.env.MYSQL_TEST_PASSWORD,
  {
    host: process.env.DB_TEST_HOST || 'localhost',
    port: process.env.ACCESS_TEST_DB_PORT || 3308, //On indique le port à utiliser pour se connecter à la DB
    dialect: 'mysql',
    logging: false, // Désactive les logs SQL lors des tests
  }
);

// Testons la connexion pour s'assurer qu'elle fonctionne correctement
sequelizeTest
  .authenticate()
  .then(() => {
    console.log('Connexion à la base de données de test établie avec succès.');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données de test:', err);
  });

module.exports = { sequelizeTest };
