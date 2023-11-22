const faker = require('faker');
faker.locale = "fr";

const typesLot = ["Infuseur à thé",
                    "Boite de 100g d'un thé détox ou d'infusion",
                    "Boite de 100g d'un thé signature",
                    "Coffret decouverte de 39 euros",
                    "Coffret decouverte de 69 euros",
                    ]

const batch_data = [];

for (const type of typesLot) {

  batch_data.push({
    employee_id : faker.random.number({ min: 1, max: 5 }),
    type_lot:type,
    valeur: faker.random.number({ min: 1, max: 1000 }),
    description: faker.lorem.sentence(),
    pourcentage_gagnant: faker.random.number({ min: 1, max: 100 })

  })
  
}


module.exports = batch_data
