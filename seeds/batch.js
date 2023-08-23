const faker = require('faker');
const db = require('./db');

const batchList = ["Infuseur à thé",
                    "Boite de 100g d'un thé détox ou d'infusion",
                    "Boite de 100g d'un thé signature",
                    "Coffret decouverte de 39 euros",
                    "Coffret decouverte de 69 euros",
                    ]

(async () => {
  const connection = db.connection();

  for (let i = 0; i < length(batchList); i++) {
    const idUser = faker.random.number({ min: 3, max: 5 });
    const valeur = faker.random.number({ min: 1, max: 1000 }); 
    const description = faker.lorem.sentence(); 
    const pourcentage_gagnant = faker.random.number({ min: 1, max: 100 });

    const insertQuery = `
      INSERT INTO batch (valeur, description, pourcentage_gagnant, type_lot, idUser, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW());
    `;

    try {
      await connection.execute(insertQuery, [valeur, description, pourcentage_gagnant, batchList[i], idUser]);
      console.log(`Inserted batch record ${batchList[i]} successfully`);
    } catch (error) {
      console.error(`Error inserting jackpot record ${batchList[i]}: ${error.message}`);
    }
  }

  db.disconnect(connection);
})();
