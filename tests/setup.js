// setup.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { sequelizeTest } = require('../db.test');
const UserModel = require('../models/userModel');
const BatchModel = require('../models/batchModel');
// Importez les autres modèles nécessaires

chai.use(chaiHttp);
// Exécuter les migrations avant les tests
before(async () => {
  await sequelizeTest.sync({ force: true });
});

// Insertion de données de test
const insertTestData = async () => {
  try {
    // Exemple : Insertion d'un utilisateur de test
    const usersData = [
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
    ];

    // Boucle pour créer les utilisateurs
    for (const userData of usersData) {
      await UserModel.create(userData);
    }

    // Vous pouvez effectuer des insertions similaires pour d'autres modèles
    // const batch = await BatchModel.create({ /* ... */ });
    // const shop = await ShopModel.create({ /* ... */ });
    // const jackpot = await JackpotModel.create({ /* ... */ });
    // const ticket = await TicketModel.create({ /* ... */ });

    console.log('Données de test insérées avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion de données de test :', error);
  }
};

// Exécuter la logique d'insertion après les migrations
before(async () => {
  await insertTestData();
});

// Nettoyer la base de données après les tests
after(async () => {
  try {
    // Supprimer tous les utilisateurs de test
    await UserModel.destroy({
      where: {
        email: {
          [Op.in]: usersData.map(user => user.email),
        },
      },
    });
    // Vous pouvez effectuer des suppressions similaires pour d'autres modèles
    // await BatchModel.destroy({ /* ... */ });
    // await ShopModel.destroy({ /* ... */ });
    // await JackpotModel.destroy({ /* ... */ });
    // await TicketModel.destroy({ /* ... */ });

    console.log('Données de test supprimées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression de données de test :', error);
  }
});
