const db = require('../db');
// Batch modèle
const Batch = db.sequelize.define("Batch", {
    id: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_lot: {
      type: db.DataTypes.STRING,
      allowNull: false,
    },
    valeur: {
      type: db.DataTypes.DECIMAL,
      allowNull: false,
    },
    state: { 
      type: db.DataTypes.ENUM('unchecked','checked', 'claimed', 'recieved'),
      defaultValue: 'unchecked'
    },
    user_id: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: db.DataTypes.TEXT,
      allowNull: false,
    },
    pourcentage_gagnant: {
      type: db.DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {  
    tableName: 'batch',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    engine: 'InnoDB',
  });

  
  module.exports = Batch;