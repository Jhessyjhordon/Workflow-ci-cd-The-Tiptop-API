const express = require('express')
require('dotenv').config();
const { swaggerUi, specs } = require('./docs/swagger');
const bodyParser = require('body-parser')

const app = express();

const userRoutes = require('./routes/userRoutes')



app.use(bodyParser.urlencoded({extended: false}))


// Intégrer Swagger UI à votre application
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/user', userRoutes);


const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });