var mysql      = require('mysql2');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'dev'}` }); // Utilisez le fichier .env.dev par défaut

//appel de sequilize
const {Sequelize, DataTypes}  = require("sequelize");
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    'root',
    process.env.MYSQL_ROOT_PASSWORD,
  {
    host: 'db',
    dialect: 'mysql'
  }
);

console.log("Configuring Sequelize with:");
console.log("Database:", process.env.MYSQL_DATABASE);
console.log("Username:", 'root'); // Vous avez codé en dur 'root' ici, assurez-vous que c'est ce que vous voulez.
console.log("Password:", process.env.MYSQL_ROOT_PASSWORD); // Faites attention à la journalisation des mots de passe
console.log("Host:", 'db'); // Vous avez également codé en dur 'db' ici comme hôte

// console.log(sequelize);
// console.log("MYSQL_DATABASE -> ", process.env.MYSQL_DATABASE, " MYSQL_ROOT_PASSWORD -> ", process.env.MYSQL_ROOT_PASSWORD, " DBHOSTNAME -> ", process.env.HOSTNAME);

const connection = () => {
    let connection =  mysql.createConnection({
        host     : process.env.DBHOSTNAME,
        user     : "root",
        password : process.env.MYSQL_ROOT_PASSWORD,
        database : process.env.MYSQL_DATABASE,
        port: process.env.ACCESS_DB_PORT, 
        // socketPath:"/var/run/mysqld/mysqld.sock"
    });
    connection.connect();

    return connection;
}

const disconnect = (connection) => { 
    return connection.end();
}

const select = (select, array, connection) => {
    let data =  connection.query(select,array, (e, r, f ) => {
        if (e) throw e
    })
    return data
}

module.exports = {
    select,
    disconnect,
    connection,
    sequelize,
    DataTypes
}



 
