const db = require('../db');
// ticket  modèle
const Ticket = db.sequelize.define("Ticket", {
    id: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numTicket: {
      type: db.DataTypes.STRING,
      allowNull: false,
    },
    montantAchat: {
      type: db.DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dateAchat: {
      type: db.DataTypes.DATE,
      allowNull: false,
    },
    gainAttribue: {
      type: db.DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    user_id: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
    },
    batch_id: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
    },
    state: { 
      type: db.DataTypes.ENUM('unchecked','checked', 'claimed', 'recieved'),
      defaultValue: 'unchecked'
    },
    statusGain: {
      type: db.DataTypes.ENUM('not demanded','demanded', 'assigned'),
      defaultValue: 'not demanded'
    },
  }, {
    tableName: 'ticket',
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    engine: 'InnoDB',
  });

  module.exports = Ticket;