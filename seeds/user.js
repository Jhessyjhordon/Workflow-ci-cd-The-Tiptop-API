const faker = require('faker');

faker.locale = "fr";

const user_data = [];
const numRecords = 15;

for (let i = 0; i < numRecords; i++) {
  const hashedPassword = "$argon2d$v=19$m=12,t=3,p=1$amFkc25tMHMxYWIwMDAwMA$QSsgSyAtNDmhby49Mj0J+g"
  const lastname = i === 0 ? "Antipas" : faker.name.lastName();
  const firstname = i === 0 ? "Fidele" : faker.name.firstName();
  user_data.push({
    firstName: firstname,
    lastName: lastname,
    email: `${firstname}.${lastname}@gmail.com`,
    phone: faker.phone.phoneNumber(),
    password: hashedPassword,
    idCompteExt: faker.random.number({ min: 1000, max: 9999 }),
    role: i < 5 ? "employee" : "customer",
    birthDate: faker.date.between("1985-01-01", "2000-01-01"),
    isVerify: i < 8 ? true : false,
  });
}

module.exports = user_data;