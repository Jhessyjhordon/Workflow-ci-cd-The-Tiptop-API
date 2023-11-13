const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Votre fichier d'application Express

const supertest = require('supertest');
const jwt = require('jsonwebtoken');


const expect = chai.expect;
chai.use(chaiHttp);

let token_employee;
let token_customer;
let token_admin;

describe('User Routes', () => {
    // Avant les tests, obtenir un token valide pour les routes qui en ont besoin
  before(async () => {
    // const server = require('../server');
    // Utilisez les informations d'identification appropriées pour les tests
    const response_employee = await chai
      .request(server)
      .post('/user/login')
      .send({ email: 'toto123456@gmail.com', password: 'password' });
    token_employee = response_employee.body.jwt;
    //console.log("Réponse de customer : ", response_employee)
    // console.log('Début du bloc before');
    const response_customer = await chai
      .request(server)
      .post('/user/login')
      .send({ email: 'toto12345@gmail.com', password: 'password' });
    token_customer = response_customer.body.jwt;
    // console.log("Réponse de customer : ", response_customer)
    const response_admin = await chai
    .request(server)
    .post('/user/login')
    .send({ email: 'fidele.antipas@gmail.com', password: 'password' });
    token_admin = response_admin.body.jwt;
    // console.log("Réponse de customer : ", response_admin)
  });

//   afterAll(() =>{
//     server.close();
//   })

  it('should have valid JWT tokens after before hook', function() { // OK
    expect(token_employee).to.be.a('string').and.to.have.length.above(20);
    expect(token_employee.split('.')).to.have.lengthOf(3);

    expect(token_customer).to.be.a('string').and.to.have.length.above(20);
    expect(token_customer.split('.')).to.have.lengthOf(3);

    expect(token_admin).to.be.a('string').and.to.have.length.above(20);
    expect(token_admin.split('.')).to.have.lengthOf(3);
  });
});

  describe('GET /user', () => {
    it('should get list of all users when token is provided and user is an employee', async () => { // OK
      console.log("Token de l'employee : ", token_employee)
      const res = await chai
        .request(server)
        .get('/user')
        .set('Authorization', 'Bearer ' + token_employee);

      console.log("Response Status:", res.status);
      console.log("Response Body:", res.body);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.users).to.be.an('array');
      console.log("token de l'utilisateur : ", token_admin)
      console.log('############################################################"')
      console.log('############################################################"')
    });

    it('should not get list of all users when token is missing', async () => { // OK
      const res = await supertest(server).get('/user');

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal(true);
      expect(res.body.message).to.include('Accès non autorisé');
    });

    it('should not get list of all users when token is expired', async () => { // OK
      const expiredToken = jwt.sign(
        { role: 'employee' },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '0s' }
      );

      const res = await chai
        .request(server)
        .get('/user')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal(true);
      expect(res.body.message).to.include('Accès refusé : Token invalide ou expiré.');
    });

    it('should not get list of all users when user is not an employee', async () => { // OK
      const res = await chai
        .request(server)
        .get('/user')
        .set('Authorization', `Bearer ${token_customer}`);

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal(true);
      expect(res.body.message).to.include("Accès refusé : vous n'êtes pas autorisé à effectuer cette action.");
    });
  });

  describe('GET /user/:id', () => {
    it('should get a user by ID (with valid token)', async () => { // OK
      const res = await chai
        .request(server)
        .get('/user/2')
        .set('Authorization', 'Bearer ' + token_employee);

      expect(res.status).to.equal(200);
      expect(res.body.error).to.be.false;
      expect(res.body).to.be.an('object');
      // Assurez-vous d'ajuster cela en fonction de la structure de votre réponse
      expect(res.body.user).to.have.property('id', 2);
    });

    it('should return a 404 if user ID does not exist', async () => { // OK
      const res = await chai
        .request(server)
        .get('/user/999')
        .set('Authorization', 'Bearer ' + token_employee);

      expect(res.status).to.equal(404);
      expect(res.body.error).to.be.true;
    });

    it('should return a 400 if ID is not a valid number', async () => { // OK
      const res = await chai
        .request(server)
        .get('/user/invalid_id')
        .set('Authorization', 'Bearer ' + token_employee);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.include("id must be a `number` type");
    });

    it('should not get a user by ID (without token)', async () => { // OK
      const userId = '5';
      const res = await supertest(server).get(`/user/${userId}`);

      expect(res.status).to.equal(401);
      expect(res.body.error).to.be.true;
    });

    it('should not get a user by ID (with valid token but not employee role)', async () => { // OK
      const invalidToken = 'autre-token-factice';
      const userId = '4';
      const res = await chai
        .request(server)
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(res.status).to.equal(403);
      expect(res.body.error).to.be.true;
    });
  });

  describe('DELETE /user/:id', () => {
    // Utilisez un ID existant dans votre base de données pour les tests positifs
    const existingUserId = '5';

    it('should not delete a user by ID (with valid token and employee or customer role)', async () => { // OK
      const res = await chai
        .request(server)
        .delete('/user/5')
        .set('Authorization', `Bearer ${token_employee}`);

      expect(res.status).to.equal(403);
      expect(res.body.error).to.be.true;
      expect(res.body.message).to.deep.equal([
        "Accès refusé : vous n\'êtes pas autorisé à effectuer cette action."
      ]);
    });

    it('should return a 404 if user ID does not exist (with valid token and employee role)', async () => { // OK
      const res = await chai
        .request(server)
        .delete('/user/888')
        .set('Authorization', 'Bearer ' + token_admin);

      expect(res.status).to.equal(404);
      expect(res.body.error).to.be.true;
      expect(res.body.message).to.deep.equal(["Utilisateur non trouvé"]);
    });

    it('should return a 400 if ID is not a valid number (with valid token and employee role)', async () => { // OK
      
      const res = await chai
        .request(server)
        .delete('/user/invalidUserId')
        .set('Authorization', 'Bearer ' + token_employee);

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.include(["Accès refusé : vous n\'êtes pas autorisé à effectuer cette action."]);
    });

    describe('PUT /user/:id', () => {
        // Utilisez un ID existant dans votre base de données pour les tests positifs
        const existingUserId = '3';
    
        it('should update a user by ID (with valid token and any role)', async () => { // OK
          const updatedUserData = {
            address: "2 Avenue de Paris, 75000 Paris",
            birthDate: "1992-02-24",
            role: "customer",
            password: "password",
            phone: "0102030405",
            email: "tototototo@gmail.com",
            firstname: "First Name",
            lastname: "Last Name"
          };
    
          const res = await chai
            .request(server)
            .put('/user/3')
            .set('Authorization', `Bearer ${token_customer}`)
            .send(updatedUserData);
    
          expect(res.status).to.equal(200);
          expect(res.body.error).to.be.false;
          expect(res.body.message).to.deep.equal([
            'Utilisateur mis à jour avec succès',
          ]);
        });
    
        it('should return a 404 if user ID does not exist (with valid token and employee role)', async () => { // OK
          const nonExistentUserId = '890';
          const updatedUserData = {
            address: "6 Avenue de Paris, 75000 Paris",
            birthDate: "1992-02-24",
            role: "customer",
            password: "password",
            phone: "0102030405",
            email: "tototototo@gmail.com",
            firstname: "First Name",
            lastname: "Last Name"
          };
    
          const res = await chai
            .request(server)
            .put(`/user/890`)
            .set('Authorization', 'Bearer ' + token_employee)
            .send(updatedUserData);
    
          expect(res.status).to.equal(404);
          expect(res.body.error).to.be.true;
          expect(res.body.message).to.deep.equal(['Utilisateur non trouvé']);
        });
    
        it('should return a 400 if ID is not a valid number (with valid token and employee role)', async () => { // OK
          const invalidUserId = 'id-invalide';
          const updatedUserData = {
            address: "6 Avenue de Paris, 75000 Paris",
            birthDate: "1992-02-24",
            role: "customer",
            password: "password",
            phone: "0102030405",
            email: "tototototo@gmail.com",
            firstname: "First ",
            lastname: "Name"
          };
    
          const res = await chai
            .request(server)
            .put(`/user/${invalidUserId}`)
            .set('Authorization', 'Bearer ' + token_employee)
            .send(updatedUserData);
    
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.true;
          expect(res.body.message).to.include('ID utilisateur invalide');
        });
    
        it('should return a 400 if update data is invalid (with valid token and employee role)', async () => { // OK
          const invalidUserData = {
            address: "6 Avenue de Paris, 75000 Paris",
            birthDate: "1992-02-24",
            role: "customer",
            password: "password",
            phone: "0102030405",
            email: "tototototo@gmail.com",
            firstname: "", // Prénom vide
            lastname: "Name"
          };
    
          const res = await chai
            .request(server)
            .put('/user/4')
            .set('Authorization', 'Bearer ' + token_employee)
            .send(invalidUserData);
    
            expect(res.status).to.equal(409);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.include("firstname is a required field");
        });
    
        it('should not update a user by ID (without token)', async () => { // OK
          const updatedUserData = {
            firstname: 'Nouveau Prénom',
            lastname: 'Nouveau Nom',
            email: 'nouveau@email.com',
            phone: '1234567890',
          };
    
          const res = await chai
            .request(server)
            .put('/user/6')
            .send(updatedUserData);
    
          expect(res.status).to.equal(401);
        });
    
    });

    describe('POST /user', () => {
        /*it('should create a new user without token', async () => { A corriger sur l'API et bien préciser qui
          const newUser = {
            address: "42 Avenue de Paris, 75000 Paris",
            birthDate: "1992-02-24",
            role: "customer",
            password: "password",
            phone: "0102030405",
            email: "totototototototo@gmail.com",
            firstname: "Totoro",
            lastname: "Name"
          };
    
          const res = await supertest(server).post('/user').send(newUser);
    
          expect(res.status).to.equal(200);
          expect(res.body.error).to.be.false;
          expect(res.body.message).to.deep.equal(['Utilisateur inscrit avec succès']);
        }); */
    
        /*it('should create a new user with valid token and employee role', async () => {
          const newUser = {
            firstname: 'Nouveau Prénom',
            lastname: 'Nouveau Nom',
            email: 'nouveau@email.com',
            phone: '1234567890',
            password: 'motdepasse',
          };
    
          const res = await chai
            .request(server)
            .post('/user')
            .set('Authorization', 'Bearer ' + token_employee)
            .send(newUser);
    
          expect(res.status).to.equal(200);
          expect(res.body.error).to.be.false;
          expect(res.body.message).to.deep.equal(['Utilisateur inscrit avec succès']);
        }); Changer l'endroit de celui ci */
    
        it('should return a 400 if registration data is invalid', async () => {
          const invalidUserData = {
            address: "42 Avenue de Paris, 75000 Paris",
            birthDate: "1992-02-24",
            role: "customer",
            password: "password",
            phone: "0102030405",
            email: "email_invalide", // Email invalide
            firstname: "", // Prénom vide
            lastname: "Name"
          };
    
          const res = await supertest(server).post('/user/register').send(invalidUserData);
    
          expect(res.status).to.equal(409);
          expect(res.body).to.be.an('object');
        });
    
        /*it('should not create a new user without token', async () => { Besoin d'info sur ce test
          const newUser = {
            firstname: 'Nouveau Prénom',
            lastname: 'Nouveau Nom',
            email: 'nouveau@email.com',
            phone: '1234567890',
            password: 'motdepasse',
          };
    
          const res = await supertest(server).post('/user').send(newUser);
    
          expect(res.status).to.equal(403);
        });*/
    
        /*it('should not create a new user with valid token but not employee role', async () => { A revoir
          const newUser = {
            firstname: 'Nouveau Prénom',
            lastname: 'Nouveau Nom',
            email: 'nouveau@email.com',
            phone: '1234567890',
            password: 'motdepasse',
        };
        const invalidToken = 'token_invalide';

          const res = await chai
            .request(server)
            .post('/user')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send(newUser);

          expect(res.status).to.equal(403);
        });   */ 

      /*it('should return a 401 if registration is attempted with an invalid token', async () => { A revoir
        const newUser = {
          firstname: 'Nouveau Prénom',
          lastname: 'Nouveau Nom',
          email: 'nouveau@email.com',
          phone: '1234567890',
          password: 'motdepasse',
        };
  
        const res = await chai
          .request(server)
          .post('/user')
          .set('Authorization', 'Bearer token_invalide')
          .send(newUser);
  
        expect(res.status).to.equal(401);
      });*/ 
    
      describe('PATCH /user/:id', () => {
        // Utilisez un ID existant dans votre base de données pour les tests positifs
      
        it('should update a user partially by ID (with valid token and employee role)', async () => {
          const updatedUserData = {
            firstname: 'Nouveau Prénom',
          };
      
          const res = await chai
            .request(server)
            .patch('/user/3')
            .set('Authorization', `Bearer ${token_employee}`)
            .send(updatedUserData);
      
          expect(res.status).to.equal(200);
          expect(res.body.error).to.be.false;
          expect(res.body.message).to.deep.equal(['Utilisateur partiellement mis à jour avec succès']);
        });
      
        it('should return a 404 if user ID does not exist (with valid token and employee role)', async () => {
          const nonExistentUserId = 'id-inexistant';
          const updatedUserData = {
            firstname: 'Nouveau Prénom',
          };
      
          const res = await chai
            .request(server)
            .patch(`/user/id-inexistant`)
            .set('Authorization', `Bearer ${token_employee}`)
            .send(updatedUserData);
      
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
        });
      
        it('should return a 400 if ID is not a valid number (with valid token and employee role)', async () => {
          const invalidUserId = 'id-invalide';
          const updatedUserData = {
            firstname: 'Nouveau Prénom',
          };
      
          const res = await chai
            .request(server)
            .patch(`/user/id-invalide`)
            .set('Authorization', `Bearer ${token_employee}`)
            .send(updatedUserData);
      
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
        });
      
        it('should return a 400 if update data is invalid (with valid token and employee role)', async () => {
          const invalidUserData = {
            firstname: '', // Prénom vide
          };
      
          const res = await chai
            .request(server)
            .patch('/user/4')
            .set('Authorization', `Bearer ${token_employee}`)
            .send(invalidUserData);
      
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
        });
      
        it('should not update a user partially by ID (without token)', async () => {
          const updatedUserData = {
            firstname: 'Nouveau Prénom',
          };
      
          const res = await supertest(server).patch('/user/6').send(updatedUserData);
      
          expect(res.status).to.equal(401);
        });
      
        it('should not update a user partially by ID (with valid token but not employee role)', async () => {
          const invalidToken = 'autre-token-factice';
          const updatedUserData = {
            firstname: 'Nouveau Prénom',
          };
      
          const res = await chai
            .request(server)
            .patch('/user/7')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send(updatedUserData);
      
          expect(res.status).to.equal(403);
        });
      });
    
    });
});
