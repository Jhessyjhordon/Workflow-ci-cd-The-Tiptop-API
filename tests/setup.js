// setup.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'dev'}` }); // Utilisez le fichier .env.dev par défaut
const chai = require('chai');
const chaiHttp = require('chai-http');
const { sequelizeTest } = require('../db.test');
const User = require('../models/userModel');
const { Op } = require("sequelize");
// Utilisez Op pour les opérations de requête
const Jackpot = require('../models/jackpotModel');
// Importez les autres modèles nécessaires

chai.use(chaiHttp);

before(async () => {
  try {
    await sequelizeTest.authenticate();
    console.log('Connection to the test database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the test database: ', error);
  }
});

before(async () => {
  try {
    await sequelizeTest.sync({ force: true });
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Unable to create tables: ', error);
    console.error('Unable to create tables:========================= ', error);
  }
});
// Exécuter les migrations avant les tests
// before(async () => {
//   await sequelizeTest.sync({ force: true });
// });

const user_data = [
  {
    firstname: 'AdminFirst',
    lastname: 'AdminLast',
    email: 'admin@example.com',
    password: 'admin_password',
    role: 'admin',
  },
  {
    firstname: 'EmployeeFirst',
    lastname: 'EmployeeLast',
    email: 'employee@example.com',
    password: 'employee_password',
    role: 'employee',
  },
  {
    firstname: 'CustomerFirst',
    lastname: 'CustomerLast',
    email: 'customer@example.com',
    password: 'customer_password',
    role: 'customer',
  },
  {
    firstname: 'toto',
    lastname: 'tata',
    email: 'toto@example.com',
    password: 'toto',
    role: 'customer',
  },
  {
    firstname: 'tomi',
    lastname: 'taty',
    email: 'taty@example.com',
    password: 'toto',
    role: 'customer',
  },
  {
    firstname: 'tony',
    lastname: 'taty',
    email: 'tony@example.com',
    password: 'toto',
    role: 'customer',
  },
  {
    firstname: 'fony',
    lastname: 'faty',
    email: 'tony@example.com',
    password: 'toto',
    role: 'customer',
  },
];

jackpot_data = [
  {
  date_tirage: "2023-08-18",
  valeur: 360, // Un de thé d'une Valeur de 360
  user_id : 6,
},

]

User.hasMany(Jackpot);

Jackpot.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

before(async () => {
  try {
    await sequelizeTest.sync({ force: true });
    const users = await User.bulkCreate(user_data);
    console.log(`${users.length} utilisateurs ont été insérés.`);

    // const jackpot = await Jackpot.bulkCreate(jackpot_data);
    // console.log(`${jackpot.length} jackpot ont / a été inséré(s).`);
  } catch (error) {
    console.error('Erreur lors de l\'insertion :', error);
  }
});

// sequelizeTest.sync().then(() => {
//   return User.bulkCreate(user_data)
//     .then((users) => {
//       console.log(`${users.length} utilisateurs ont été insérés.`);
//     })
    
//     .catch((error) => {
//       console.error('Erreur lors de l\'insertion :', error);
//     });
// }).catch((error) => {
//   console.error('Unable to create table : ', error);
// });
// Insertion de données de test
// const insertTestData = async () => {
//   try {
//     // Exemple : Insertion d'un utilisateur de test
   

//     // Boucle pour créer les utilisateurs
//     try {
//       await User.bulkCreate(usersData);
//       console.log('User test data inserted successfully.');
//     } catch (error) {
//       console.error('Error inserting user test data: ', error);
//     }

//     // Vous pouvez effectuer des insertions similaires pour d'autres modèles
//     // const batch = await BatchModel.create({ /* ... */ });
//     // const shop = await ShopModel.create({ /* ... */ });
//     // await Jackpot.create( jackpot_data);
//     // const ticket = await TicketModel.create({ /* ... */ });

//     console.log('Données de test insérées avec succès.');
//   } catch (error) {
//     console.error('Erreur lors de l\'insertion de données de test :', error);
//   }
// };

// Exécuter la logique d'insertion après les migrations
// before(async () => {
//   await insertTestData();
// });

// Nettoyer la base de données après les tests
// after(async () => {
//   try {
//     // Supprimer tous les utilisateurs de test
//     await User.destroy({
//       where: {
//         email: {
//           [Op.in]: usersData.map(user => user.email),
//         },
//       },
//     });
//     // Vous pouvez effectuer des suppressions similaires pour d'autres modèles
//     // await BatchModel.destroy({ /* ... */ });
//     // await ShopModel.destroy({ /* ... */ });
//     await Jackpot.destroy({ 
//       where: {
//         valeur: 360
//       },
//     });
//     // await TicketModel.destroy({ /* ... */ });

//     console.log('Données de test supprimées avec succès.');
//   } catch (error) {
//     console.error('Erreur lors de la suppression de données de test :', error);
//   }
// });
