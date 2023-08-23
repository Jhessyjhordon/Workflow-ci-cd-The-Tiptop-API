const faker = require('faker');
const db = require('./db');

const numRecords = 100;

(async () => {
  const connection = db.connection();

  for (let i = 0; i < numRecords; i++) {
    batchId = 0
    if (i <= 3) {
        batchId = 5
    }
    else if (i <= 9) {
        batchId = 4
    }       
    else if (i <= 19) {
        batchId = 3
    }    
    else if (i <= 39) {
        batchId = 2
    }
    else{
        batchId = 1
    } 
    const userId = faker.random.number({ min: 5, max: 15 });
    const numTicket = faker.random.number({ min: 1000, max: 9999 });
    const montantTicket = faker.random.number({ min: 10, max: 100 });
    const dateAchat = faker.date.past();
    const gainAttribue = faker.random.boolean();
    const statusGain = gainAttribue ? 'Attribué' : 'Non attribué';

    const insertQuery = `
    INSERT INTO tickets (numTicket, montantTicket, dateAchat, gainAttribue, statusGain, batchId, userId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
  `;

    try {
      await connection.execute(insertQuery, [numTicket, montantTicket, dateAchat, gainAttribue, statusGain, batchId, userId]);
      console.log(`Inserted ticket record ${i + 1} successfully`);
    } catch (error) {
      console.error(`Error inserting ticket record ${i + 1}: ${error.message}`);
    }
  }

  db.disconnect(connection);
})();
