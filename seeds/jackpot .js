const faker = require('faker');
const db = require('./db');

const numRecords = 10;

(async () => {
  const connection = db.connection();

  for (let i = 0; i < numRecords; i++) {
    const dateClientGagnant = faker.date.past();
    const idUser = faker.random.number({ min: 1, max: 5 });

    const insertQuery = `
      INSERT INTO jackpot (dateClientGagnant, idUser, createdAt, updatedAt)
      VALUES (?, ?, NOW(), NOW());
    `;

    try {
      await connection.execute(insertQuery, [dateClientGagnant, idUser]);
      console.log(`Inserted jackpot record ${i + 1} successfully`);
    } catch (error) {
      console.error(`Error inserting jackpot record ${i + 1}: ${error.message}`);
    }
  }

  db.disconnect(connection);
})();
