const db = require('../db');
// User modèle
const User = db.sequelize.define('User', {
    // Model attributes are defined here
    id: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: db.DataTypes.STRING(255),
      allowNull: false
    },
    lastname: {
      type: db.DataTypes.STRING(255),
      allowNull: false
    },
    email: {
        type: db.DataTypes.STRING(255),
        allowNull: false
      },
    phone: {
        type: db.DataTypes.STRING(15),
        allowNull: true,
      },
    address: {
        type: db.DataTypes.STRING(155),
        allowNull: true,
      },
    password: { 
      type: db.DataTypes.STRING(255),
      allowNull: true,
     },
    role: { 
      type: db.DataTypes.ENUM('admin','employee', 'customer'),
      allowNull: false,
    },
    birthDate:{
        type: db.DataTypes.DATE,
        allowNull: true
    },
    isVerify:{
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    photoUrl:{
        type: db.DataTypes.STRING(255),
        defaultValue: true
    },
    token: {
      type: db.DataTypes.STRING(255),
      allowNull: true,
    },
    expiresAt: {
      type: db.DataTypes.DATE,
      allowNull: true,
    },
  confirmAt: {
    type: db.DataTypes.DATE,
    allowNull: true,
  },
  },{
    tableName: 'user', // Le nom de la table dans la base de données
    timestamps: true, // Pour inclure createdAt et updatedAt
    underscored: true, // Utilisation de snake_case pour les noms de colonnes
    charset: 'utf8', // Encodage des caractères
    collate: 'utf8_general_ci', // Collation des caractères
    engine: 'InnoDB', // Type de moteur de stockage
  }
  );
  
module.exports = User;
