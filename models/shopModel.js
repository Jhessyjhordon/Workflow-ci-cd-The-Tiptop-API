const db = require('../db');


  // shop  modèle
  const Shop = db.sequelize.define("Shop", {
    id: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: db.DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: db.DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: db.DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'shop',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    engine: 'InnoDB',
  });
  
  module.exports = Shop;