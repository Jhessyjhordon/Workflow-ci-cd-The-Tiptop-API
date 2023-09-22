const faker = require('faker');

faker.locale = "fr";

const ticket_data = [];
    const numRecords = 100;

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
      gainAttribue = faker.random.boolean()
      ticket_data.push({
        batch_id:batchId,
        user_id : faker.random.number({ min: 6, max: 15 }),
       numTicket : faker.random.number({ min: 1000, max: 9999 }),
       montantAchat : faker.random.number({ min: 10, max: 100 }),
       dateAchat : faker.date.past(),
       gainAttribue : gainAttribue,
       statusGain : gainAttribue ? 'Attribué' : 'Non attribué',
      })
    }

module.exports = ticket_data;
