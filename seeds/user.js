const faker = require('faker');
const db = require('./db');

const numRecords = 10;

(async () => {
  const connection = db.connection();

  for (let i = 0; i < numRecords; i++) {
    const lastname = faker.name.lastName();
    const firstname = faker.name.firstName();
    const email = faker.internet.email();
    const phone = faker.phone.phoneNumber();
    const password = faker.internet.password();
    const idCompteExt = faker.random.number({ min: 1000, max: 9999 });
    const role = faker.random.arrayElement(['customer', 'employee']); // Remplacez par les rôles possibles

    const insertQuery = `
      INSERT INTO user (lastname, firstname, email, phone, password, idCompteExt, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
    `;

    try {
      await connection.execute(insertQuery, [lastname, firstname, email, phone, password, idCompteExt, role]);
      console.log(`Inserted user record ${i + 1} successfully`);
    } catch (error) {
      console.error(`Error inserting user record ${i + 1}: ${error.message}`);
    }
  }

  db.disconnect(connection);
})();
