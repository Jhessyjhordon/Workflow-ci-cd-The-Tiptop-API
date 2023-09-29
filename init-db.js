const db = require('./db');

const User = require('./models/userModel')
const Batch = require('./models/batchModel')
const Shop = require('./models/shopModel')
const Jackpot = require('./models/jackpotModel')
const Ticket = require('./models/ticketModel')

const user_data = require('./seeds/user');
const batch_data = require('./seeds/batch');
const shop_data = require('./seeds/shop');
const jackpot_data = require('./seeds/jackpot');
const ticket_data = require('./seeds/ticket');

db.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

// Relations:
// Définition des relations
User.hasMany(Shop);
User.hasMany(Ticket);
User.hasMany(Jackpot);
User.hasMany(Batch);

Batch.hasMany(Ticket);
Batch.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

Jackpot.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

Ticket.belongsTo(Batch, { as: 'Batch', foreignKey: 'batch_id' });
Ticket.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

Shop.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

// data insertion
db.sequelize.sync().then(() => {
  return User.bulkCreate(user_data)
    .then((users) => {
      console.log(`${users.length} utilisateurs ont été insérés.`);
    })
    .then(() => {
      return Batch.bulkCreate(batch_data)
        .then((batchs) => {
          console.log(`${batchs.length} lots ont été insérés.`);
        });
    })
    .then(() => {
      return Jackpot.bulkCreate(jackpot_data)
        .then((jackpots) => {
          console.log(`${jackpots.length} jackpot a été inséré.`);
        });
    })
    .then(() => {
      return Shop.bulkCreate(shop_data)
        .then((shops) => {
          console.log(`${shops.length} shops ont été insérés.`);
        });
    })
    .then(() => {
      return Ticket.bulkCreate(ticket_data)
        .then((tickets) => {
          console.log(`${tickets.length} tickets ont été insérés.`);
        });
    })
    .catch((error) => {
      console.error('Erreur lors de l\'insertion :', error);
    });
}).catch((error) => {
  console.error('Unable to create table : ', error);
});
