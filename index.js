const express = require('express')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'dev'}` }); // Utilisez le fichier .env.dev par défaut
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);
console.log('Database Host:', process.env.DBHOSTNAME);
console.log('Database User:', process.env.MYSQL_USER);
console.log('Database Name:', process.env.MYSQL_DATABASE);
const { swaggerUi, specs } = require('./docs/swagger');
const bodyParser = require('body-parser')
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { cleanExpiredLinks } = require('./tasks/scheduledTasks');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

const userRoutes = require('./routes/userRoutes')
const shopRoutes = require('./routes/shopRoutes')
const batchRoutes = require('./routes/batchRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const jackpothRoutes = require('./routes/jackpotRoutes')

// Configure session management
app.use(session({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: process.env.THETIPTOP_FRONT_URL,
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configure Google OAuth2.0
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback   : true,
  scope: ['profile', 'email'],
}, (req,accessToken, refreshToken, profile, done) => {
  // Handle user information and authentication here
  // 'profile' contains user information
  return done(null, profile);
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

cleanExpiredLinks.start();
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





// Define your routes for Google SSO
// app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));
// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         // Successful authentication, redirect to a success page or generate JWT tokens.
//         res.redirect('/success');
//     });


module.exports = app;