const express = require('express')
require('dotenv').config();
const { swaggerUi, specs } = require('./docs/swagger');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/userRoutes')
const shopRoutes = require('./routes/shopRoutes')


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res, next) {
  res.json({msg: 'Welcome to th2 Tiptop Api documentation'})
})
 
// Intégrer Swagger UI à votre application
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use('/user', userRoutes);
app.use('/shop', shopRoutes);


const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });