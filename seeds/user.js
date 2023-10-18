const faker = require('faker');
const argon2 = require('argon2');
const bcrypt = require('bcrypt')

faker.locale = "fr";

const user_data = [];
const numRecords = 15;

// async function generateUsers() {
for (let i = 0; i < numRecords; i++) {
  // const hashedPassword = "password";
  // const hashedPassword = await argon2.hash("password");
  saltRounds = 10
  // const hashedPassword = bcrypt.hashSync("password", saltRounds);
  const hashedPassword = "password";
  const lastname = i === 0 ? "Antipas" : faker.name.lastName();
  const firstname = i === 0 ? "Fidele" : faker.name.firstName();
  user_data.push({
    firstname: firstname,
    lastname: lastname,
    email: `${firstname.toLowerCase() }.${lastname.toLowerCase()}@gmail.com`,
    phone: faker.phone.phoneNumber(),
    password: hashedPassword,
    // idCompteExt: faker.random.number({ min: 1000, max: 9999 }),
    role: i < 5 ? i == 0 ? "admin": "employee" : "customer",
    birthDate: faker.date.between("1985-01-01", "2000-01-01"),
    isVerify: i < 8 ? true : false,
  });
}
// }

// generateUsers().then(() => {
  // À ce stade, user_data est rempli avec les données d'utilisateurs générées de manière asynchrone.
  // Vous pouvez maintenant utiliser user_data comme bon vous semble.
//   console.log("tout s'est bien passé")
// });

module.exports = user_data;