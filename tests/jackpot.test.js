const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Votre fichier d'application Express
const expect = chai.expect;

chai.use(chaiHttp);

describe('Jackpot Routes', () => {
    let token; // Pour stocker le token
    const fakeToken = 'votre-token-factice';
  
    // Avant les tests, obtenir un token valide pour les routes qui en ont besoin
    before(async () => {
      const response = await chai.request(app)
        .post('/user/login')
        .send({ email: 'user@example.com', password: 'password' }); // Utilisez des données appropriées pour les tests
      token = response.body.jwt;
    });
  
    describe('GET /jackpot', () => {
        it('should get a list of all jackpots when token is provided', async () => {
            const res = await chai.request(app)
                .get('/jackpot')
                .set('Authorization', `Bearer ${token}`);
    
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.jackpots).to.be.an('array');
        });
    
        it('should not get list of all jackpots when token is missing', async () => {
            const res = await chai.request(app)
                .get('/jackpot');
    
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal(true);
            expect(res.body.message).to.include('Accès non autorisé');
        });
    
        it('should not get list of all jackpots when token is expired', async () => {
            const expiredToken = jwt.sign({ role: 'employee' }, process.env.JWT_SECRET_KEY, { expiresIn: '0s' }); // Générer un token expiré
            const res = await chai.request(app)
                .get('/jackpot')
                .set('Authorization', `Bearer ${expiredToken}`);
    
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal(true);
            expect(res.body.message).to.include('Veillez vous reconnecter');
        });
    
        it('should not get list of all jackpots when user is not an employee', async () => {
            const res = await chai.request(app)
                .get('/jackpot')
                .set('Authorization', `Bearer ${token_customer}`); // Utiliser un token de client
    
            expect(res).to.have.status(403);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal(true);
            expect(res.body.message).to.include('Accès refusé');
        });
    });

    describe('GET /jackpot/:id', () => {
        it('should get a jackpot by ID (with valid token)', async () => {
            const res = await chai.request(app)
                .get('/jackpot/2')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res).to.have.status(200);
            expect(res.body.error).to.be.false;
            expect(res.body).to.be.an('object');
            expect(res.body.jackpot).to.have.property('id', jackpotId);
        });
      
        it('should return a 404 if jackpot ID does not exist', async () => {
            const res = await chai.request(app)
                .get("/jackpot/999")
                .set('Authorization', `Bearer ${token}`);
      
            expect(res).to.have.status(404);
            expect(res.body.error).to.be.true;
        });
      
        it('should return a 400 if ID is not a valid number', async () => {
            const res = await chai.request(app)
                .get('/jackpot/invalid_id')
                .set('Authorization', `Bearer ${token}`);
      
                expect(res).to.have.status(400);
                expect(res.body.error).to.be.true;
        });

        it('should not get a jackpot by ID (without token)', async () => {
            const jackpotId = 'votre-id-de-jackpot-factice';
            const res = await chai.request(app).get(`/jackpot/${jackpotId}`);

            expect(res).to.have.status(403);
            expect(res.body.error).to.be.true;
        });

        it('should not get a jackpot by ID (with valid token but not employee role)', async () => {
            const invalidToken = 'autre-token-factice';
            const jackpotId = 'votre-id-de-jackpot-factice';
            const res = await chai.request(app)
                .get(`/jackpot/${jackpotId}`)
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(res).to.have.status(403);
            expect(res.body.error).to.be.true;
        });
    });

    describe('DELETE /jackpot/:id', () => {
        // Utilisez un ID existant dans votre base de données pour les tests positifs
        const existingJackpotId = 'votre-id-de-jackpot-existant';
    
        it('should delete a jackpot by ID (with valid token and employee role)', async () => {
            const res = await chai.request(app)
                .delete(`/jackpot/${existingJackpotId}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(res).to.have.status(200);
            expect(res.body.error).to.be.false;
            expect(res.body.message).to.deep.equal(['Jackpot supprimé avec succès']);
        });
    
        it('should return a 404 if jackpot ID does not exist (with valid token and employee role)', async () => {
            const nonExistentJackpotId = 'id-inexistant';
            const res = await chai.request(app)
                .delete(`/jackpot/${nonExistentJackpotId}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(res).to.have.status(404);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.deep.equal(['Jackpot non trouvé']);
        });
    
        it('should return a 400 if ID is not a valid number (with valid token and employee role)', async () => {
            const invalidJackpotId = 'id-invalide';
            const res = await chai.request(app)
                .delete(`/jackpot/${invalidJackpotId}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(res).to.have.status(400);
            expect(res.body.error).to.be.true;
            expect(res.body.message).to.include('ID du jackpot invalide');
        });
    
        it('should not delete a jackpot by ID (without token)', async () => {
            const res = await chai.request(app).delete(`/jackpot/${existingJackpotId}`);
    
            expect(res).to.have.status(403);
        });
    
        it('should not delete a jackpot by ID (with valid token but not employee role)', async () => {
            const invalidToken = 'autre-token-factice';
            const res = await chai.request(app)
                .delete(`/jackpot/${existingJackpotId}`)
                .set('Authorization', `Bearer ${invalidToken}`);
        
            expect(res).to.have.status(403);
        });
        
        describe('PUT /jackpot/:id', () => {
            // Utilisez un ID existant dans votre base de données pour les tests positifs
            const existingJackpotId = 'votre-id-de-jackpot-existant';
        
            it('should update a jackpot by ID (with valid token and employee role)', async () => {
                const updatedJackpotData = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
        
                const res = await chai.request(app)
                    .put(`/jackpot/${existingJackpotId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(updatedJackpotData);
        
                expect(res).to.have.status(200);
                expect(res.body.error).to.be.false;
                expect(res.body.message).to.deep.equal(['Jackpot mis à jour avec succès']);
            });
        
            it('should return a 404 if jackpot ID does not exist (with valid token and employee role)', async () => {
                const nonExistentJackpotId = 'id-inexistant';
                const updatedJackpotData = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
        
                const res = await chai.request(app)
                    .put(`/jackpot/${nonExistentJackpotId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(updatedJackpotData);
        
                expect(res).to.have.status(404);
                expect(res.body.error).to.be.true;
                expect(res.body.message).to.deep.equal(['Jackpot non trouvé']);
            });
        
            it('should return a 400 if ID is not a valid number (with valid token and employee role)', async () => {
                const invalidJackpotId = 'id-invalide';
                const updatedJackpotData = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
        
                const res = await chai.request(app)
                    .put(`/jackpot/${invalidJackpotId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(updatedJackpotData);
        
                expect(res).to.have.status(400);
                expect(res.body.error).to.be.true;
                expect(res.body.message).to.include('ID du jackpot invalide');
            });
        
            it('should return a 400 if update data is invalid (with valid token and employee role)', async () => {
                const invalidJackpotData = {
                    dateClientGagnant: '', // Date vide
                    userId: 'Nouvel Utilisateur'
                };
        
                const res = await chai.request(app)
                    .put(`/jackpot/${existingJackpotId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(invalidJackpotData);
        
                expect(res).to.have.status(400);
                expect(res.body.error).to.be.true;
                expect(res.body.message).to.include('Données de mise à jour invalides');
            });
        
            it('should not update a jackpot by ID (without token)', async () => {
                const updatedJackpotData = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
        
                const res = await chai.request(app)
                    .put(`/jackpot/${existingJackpotId}`)
                    .send(updatedJackpotData);
        
                expect(res).to.have.status(403);
            });
        
            it('should not update a jackpot by ID (with valid token but not employee role)', async () => {
                const invalidToken = 'autre-token-factice';
                const updatedJackpotData = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
        
                const res = await chai.request(app)
                    .put(`/jackpot/${existingJackpotId}`)
                    .set('Authorization', `Bearer ${invalidToken}`)
                    .send(updatedJackpotData);
        
                expect(res).to.have.status(403);
            });
        });
        
        describe('POST /jackpot', () => {
            it('should create a new jackpot without token', async () => {
                const newJackpot = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
    
                const res = await chai.request(app)
                    .post('/jackpot')
                    .send(newJackpot);
    
                expect(res).to.have.status(201);
                expect(res.body.error).to.be.false;
                expect(res.body.message).to.deep.equal(['Jackpot enregistré avec succès']);
            });
    
            it('should create a new jackpot with a valid token and employee role', async () => {
                const newJackpot = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
    
                const res = await chai.request(app)
                    .post('/jackpot')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newJackpot);
    
                expect(res).to.have.status(201);
                expect(res.body.error).to.be.false;
                expect(res.body.message).to.deep.equal(['Jackpot enregistré avec succès']);
            });
    
            it('should return a 400 if registration data is invalid', async () => {
                const invalidJackpotData = {
                    dateClientGagnant: '', // Date vide
                    userId: 'Nouvel Utilisateur'
                };
    
                const res = await chai.request(app)
                    .post('/jackpot')
                    .send(invalidJackpotData);
    
                expect(res).to.have.status(400);
                expect(res.body.error).to.be.true;
                expect(res.body.message).to.include('Données d\'enregistrement invalides');
            });
    
            it('should not create a new jackpot without token', async () => {
                const newJackpot = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
    
                const res = await chai.request(app)
                    .post('/jackpot')
                    .send(newJackpot);
    
                expect(res).to.have.status(403);
            });
    
            it('should not create a new jackpot with a valid token but not an employee role', async () => {
                const newJackpot = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
    
                const invalidToken = 'autre-token-factice';
    
                const res = await chai.request(app)
                    .post('/jackpot')
                    .set('Authorization', `Bearer ${invalidToken}`)
                    .send(newJackpot);
    
                expect(res).to.have.status(403);
            });
    
            it('should return a 401 if registration is attempted with an invalid token', async () => {
                const newJackpot = {
                    dateClientGagnant: 'Nouvelle Date',
                    userId: 'Nouvel Utilisateur'
                };
    
                const res = await chai.request(app)
                    .post('/jackpot')
                    .set('Authorization', 'Bearer token_invalide')
                    .send(newJackpot);
    
                expect(res).to.have.status(401);
            });
        });
    });
})