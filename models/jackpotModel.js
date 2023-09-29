const db = require('../db');

  
  // jackpot modèle
  const Jackpot = db.sequelize.define("Jackpot", {
    id: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_tirage: {
      type: db.DataTypes.DATE,
      allowNull: false,
    },
    valeur: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'jackpot',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    engine: 'InnoDB',
  });

  
  module.exports = Jackpot;