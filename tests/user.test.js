const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Votre fichier d'application Express
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users API', () => {
    describe('GET /user', () => {
        it('should return all Users', async () => {
            const res = await chai.request(app).get('/user');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });
    });

    // Ajoutez d'autres tests pour les autres routes (GET /:id, DELETE /:id, PUT /:id, POST /)
});