const faker = require('faker');

faker.locale = "fr";

shop_data =[]

const numRecords = 5;

for (let i = 0; i < numRecords; i++) {
  shop_data.push({
    name : faker.company.companyName(),
    address : faker.address.streetAddress(),
    city : faker.address.city(),
    userId : faker.random.number({ min: 1, max: 5 }),
  })
}

module.exports = shop_data;
