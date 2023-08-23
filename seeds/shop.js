const faker = require('faker');
const db = require('./db');

const numRecords = 5;

(async () => {
  const connection = db.connection();

  for (let i = 0; i < numRecords; i++) {
    const name = faker.company.companyName();
    const address = faker.address.streetAddress();
    const city = faker.address.city();
    const userId = faker.random.number({ min: 1, max: 5}); 

    const insertQuery = `
      INSERT INTO shop (name, address, city, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NOW(), NOW());
    `;

    try {
      await connection.execute(insertQuery, [name, address, city, userId]);
      console.log(`Inserted shop record ${i + 1} successfully`);
    } catch (error) {
      console.error(`Error inserting shop record ${i + 1}: ${error.message}`);
    }
  }

  db.disconnect(connection);
})();
