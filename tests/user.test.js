const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Votre fichier d'application Express
const server = require('../server'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Routes', () => {
    let token; // Pour stocker le token
    const fakeToken = 'votre-token-factice';
  
    // Avant les tests, obtenir un token valide pour les routes qui en ont besoin
    before(async () => {
      const response = await chai.request(server)
        .post('/user/login')
        .send({ email: 'fidele.antipas@gmail.com', password: 'password' }); // Utilisez des données appropriées pour les tests
      token = response.body.jwt;
    });
    
    describe('GET /user', () => {
        it('should get list of all users when token is provided and user is an employee', async () => {
            const res = await chai.request(server)
                .get('/user')
                .set('Authorization', `Bearer ${token_employee}`); // Utiliser un token d'employé valide
    
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.users).to.be.an('array');
        });
    
        it('should not get list of all users when token is missing', async () => {
            const res = await chai.request(server)
                .get('/user');
    
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal(true);
            expect(res.body.message).to.include('Accès non autorisé');
        });
    
        it('should not get list of all users when token is expired', async () => {
            const expiredToken = jwt.sign({ role: 'employee' }, process.env.JWT_SECRET_KEY, { expiresIn: '0s' }); // Générer un token expiré
            const res = await chai.request(server)
                .get('/user')
                .set('Authorization', `Bearer ${expiredToken}`);
    
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal(true);
            expect(res.body.message).to.include('Veillez vous reconnecter');
        });
    
        it('should not get list of all users when user is not an employee', async () => {
            const res = await chai.request(server)
                .get('/user')
                .set('Authorization', `Bearer ${token_customer}`); // Utiliser un token de client
    
            expect(res).to.have.status(403);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal(server);
            expect(res.body.message).to.include('Accès refusé');
        });
    });
    
  
    describe('GET /user/:id', () => {
        it('should get a user by ID (with valid token)', async () => {
            const res = await chai.request(server)
                .get('/user/2')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res).to.have.status(200);
            expect(res.body.error).to.be.false;
            expect(res.body).to.be.an('object');
            expect(res.body.user).to.have.property('id', userId);
        });
      
        it('should return a 404 if user ID does not exist', async () => {
            const res = await chai.request(server)
                .get("/user/999")
                .set('Authorization', `Bearer ${token}`);
          
      
            expect(res).to.have.status(404);
            expect(res.body.error).to.be.true;
        });
      
        it('should return a 400 if ID is not a valid number', async () => {
            const res = await chai.request(server)
                .get('/user/invalid_id')
                .set('Authorization', `Bearer ${token}`);
      
                expect(res).to.have.status(400);
                expect(res.body.error).to.be.true;
        });

        it('should not get a user by ID (without token)', async () => {
            const userId = 'votre-id-d-utilisateur-factice';
            const res = await chai.request(server).get(`/user/${userId}`);

            expect(res).to.have.status(403);
            expect(res.body.error).to.be.true;
        });

        it('should not get a user by ID (with valid token but not employee role)', async () => {
            const invalidToken = 'autre-token-factice';
            const userId = 'votre-id-d-utilisateur-factice';
            const res = await chai.request(server)
                .get(`/user/${userId}`)
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(res).to.have.status(403);
            expect(res.body.error).to.be.true;
        });


    });
    
    describe('DELETE /user/:id', () => {
        // Utilisez un ID existant dans votre base de données pour les tests positifs
        const existingUserId = 'votre-id-d-utilisateur-existant';
    
        it('should delete a user by ID (with valid token and employee role)', async () => {
            const res = await chai.request(server)
                .delete('/user/15')
                .set('Authorization', `Bearer ${token}`);
    
            expect(res).to.have.status(200);
            expect(res.body.error).to.be.false;
            expect(res.body.message).to.deep.equal(['Utilisateur supprimé avec succès']);
        });
    
        it('should return a 404 if user ID does not exist (with valid token and employee role)', async () => {
            const nonExistentUserId = 'id-inexistant';
            const res = await chai.request(server)
                .delete(`/user/${nonExistentUserId}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(res).to.have.status(404);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.deep.equal(['Utilisateur non trouvé']);
        });
    
        it('should return a 400 if ID is not a valid number (with valid token and employee role)', async () => {
            const invalidUserId = 'id-invalide';
            const res = await chai.request(server)
                .delete(`/user/${invalidUserId}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.include('ID de l\'utilisateur invalide');
        });
    
        it('should not delete a user by ID (without token)', async () => {
            const res = await chai.request(server).delete("/user/10");
    
            expect(res).to.have.status(403);
        });
    
        it('should not delete a user by ID (with valid token but not employee role)', async () => {
            const invalidToken = 'autre-token-factice';
            const res = await chai.request(server)
                .delete("/user/11")
                .set('Authorization', `Bearer ${invalidToken}`);
    
            expect(res).to.have.status(403);
        });
    });
    
      
    describe('PUT /user/:id', () => {
        // Utilisez un ID existant dans votre base de données pour les tests positifs
        const existingUserId = 'votre-id-d-utilisateur-existant';
    
        it('should update a user by ID (with valid token and employee role)', async () => {
            const updatedUserData = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890'
            };
    
            const res = await chai.request(server)
                .put("/user/3")
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUserData);
    
            expect(res).to.have.status(200);
            expect(res.body.error).to.be.false;
            expect(res.body.message).to.deep.equal(['Utilisateur mis à jour avec succès']);
        });
    
        it('should return a 404 if user ID does not exist (with valid token and employee role)', async () => {
            const nonExistentUserId = 'id-inexistant';
            const updatedUserData = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890'
            };
    
            const res = await chai.request(server)
                .put(`/user/${nonExistentUserId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUserData);
    
            expect(res).to.have.status(404);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.deep.equal(['Utilisateur non trouvé']);
        });
    
        it('should return a 400 if ID is not a valid number (with valid token and employee role)', async () => {
            const invalidUserId = 'id-invalide';
            const updatedUserData = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890'
            };
    
            const res = await chai.request(server)
                .put(`/user/${invalidUserId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUserData);
    
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.include('ID de l\'utilisateur invalide');
        });
    
        it('should return a 400 if update data is invalid (with valid token and employee role)', async () => {
            const invalidUserData = {
                firstname: '', // Prénom vide
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890'
            };
    
            const res = await chai.request(server)
                .put("/user/4")
                .set('Authorization', `Bearer ${token}`)
                .send(invalidUserData);
    
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.include('Données de mise à jour invalides');
        });
    
        it('should not update a user by ID (without token)', async () => {
            const updatedUserData = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890'
            };
    
            const res = await chai.request(server)
                .put("/user/6")
                .send(updatedUserData);
    
            expect(res).to.have.status(403);
        });
    
        it('should not update a user by ID (with valid token but not employee role)', async () => {
            const invalidToken = 'autre-token-factice';
            const updatedUserData = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890'
            };
    
            const res = await chai.request(server)
                .put("/user/7")
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUserData);
    
            expect(res).to.have.status(403);
        });
    });
    
    describe('POST /user', () => {
        it('should create a new user without token', async () => {
            const newUser = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890',
                password: 'motdepasse'
            };
    
            const res = await chai.request(server)
                .post('/user')
                .send(newUser);
    
            expect(res).to.have.status(200);
            expect(res.body.error).to.be.false;
            expect(res.body.message).to.deep.equal(['Utilisateur inscrit avec succès']);
        });
    
        it('should create a new user with valid token and employee role', async () => {
            const newUser = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890',
                password: 'motdepasse'
            };
    
            const res = await chai.request(server)
                .post('/user')
                .set('Authorization', `Bearer ${token}`)
                .send(newUser);
    
            expect(res).to.have.status(200);
            expect(res.body.error).to.be.false;
            expect(res.body.message).to.deep.equal(['Utilisateur inscrit avec succès']);
        });
    
        it('should return a 400 if registration data is invalid', async () => {
            const invalidUserData = {
                firstname: '', // Prénom vide
                lastname: 'Nouveau Nom',
                email: 'email_invalide', // Email invalide
                phone: '1234567890',
                password: 'motdepasse'
            };
    
            const res = await chai.request(server)
                .post('/user')
                .send(invalidUserData);
    
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.include('Données d\'enregistrement invalides');
        });
    
        it('should not create a new user without token', async () => {
            const newUser = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890',
                password: 'motdepasse'
            };
    
            const res = await chai.request(server)
                .post('/user')
                .send(newUser);
    
            expect(res).to.have.status(403);
        });
    
        it('should not create a new user with valid token but not employee role', async () => {
            const newUser = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890',
                password: 'motdepasse'
            };
    
            const invalidToken = 'token_invalide';
    
            const res = await chai.request(server)
                .post('/user')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(newUser);
    
            expect(res).to.have.status(403);
        });
    
        it('should return a 401 if registration is attempted with an invalid token', async () => {
            const newUser = {
                firstname: 'Nouveau Prénom',
                lastname: 'Nouveau Nom',
                email: 'nouveau@email.com',
                phone: '1234567890',
                password: 'motdepasse'
            };
    
            const res = await chai.request(server)
                .post('/user')
                .set('Authorization', 'Bearer token_invalide')
                .send(newUser);
    
            expect(res).to.have.status(401);
        });
    });
  });