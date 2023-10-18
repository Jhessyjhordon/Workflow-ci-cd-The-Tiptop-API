const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Thé Tiptop Api',
      version: '1.0.0',
      description: 'Cette API a été mise en place dans le cadre d\'un projet de fin d\'année pour la validation du diplôme de Master 2 Architecte Web.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "x-auth-token",
          scheme: "bearer",
          in: "header",
        },
      },
    },
    security: [{ 
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    }], // Utilisation de Bearer
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
