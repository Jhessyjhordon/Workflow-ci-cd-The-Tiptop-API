const express = require('express')
require('dotenv').config();
const { swaggerUi, specs } = require('./docs/swagger');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/userRoutes')
const shopRoutes = require('./routes/shopRoutes')
const batchRoutes = require('./routes/batchRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const jackpothRoutes = require('./routes/jackpotRoutes')


// app.use(cors({
//   origin: 'http://api.dev.dsp-archiwebo22b-ji-rw-ah.fr/',
// }));
// app.use(cors({
//   origin: 'http://51.254.97.98:4000/',
// }));
app.use(cors({
  origin: '*',
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res, next) {
  res.json({ msg: 'Welcome to th2 Tiptop Api documentation' })
})

// Intégrer Swagger UI à votre application
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use('/user', userRoutes);
app.use('/shop', shopRoutes);
app.use('/batch', batchRoutes);
app.use('/ticket', ticketRoutes);
app.use('/jackpot', jackpothRoutes);


const PORT = process.env.PORT || 4000;

// test pipeline from the api index.js 2
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});