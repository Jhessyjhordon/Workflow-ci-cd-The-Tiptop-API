const faker = require('faker');

faker.locale = "fr";

const today = new Date();

// Obtenez une date 10 jours plus tard
const futureDate = new Date(today);
futureDate.setDate(today.getDate() + 30);

jackpot_data = [{
  date_tirage: faker.date.between(today, futureDate),
  valeur: 360, // Un de thé d'une Valeur de 360
  user_id : faker.random.number({ min: 6, max: 15 }),
}]


module.exports = jackpot_data;