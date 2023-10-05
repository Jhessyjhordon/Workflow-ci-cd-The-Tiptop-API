var mysql      = require('mysql2');
require('dotenv').config();

//appel de sequilize
const {Sequelize, DataTypes}  = require("sequelize");
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    'root',
    process.env.MYSQL_ROOT_PASSWORD,
  {
    host: process.env.HOSTNAME,
    dialect: 'mysql'
  }
);

const connection = () => {
    let connection =  mysql.createConnection({
        host     : process.env.HOSTNAME,
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



 
