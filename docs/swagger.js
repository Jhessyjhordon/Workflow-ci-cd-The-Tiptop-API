const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Thé Tiptop Api',
      version: '1.0.0',
      description: 'Cette Api, a été mis en place dans le cadre du projet de fin d\'un projet de fin d\'année pour validation du Diplome de Master 2 Architecte Web',
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
