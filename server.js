const app = require('./index');

const PORT = process.env.PORT || 4000;

// test pipeline from the api index.js 2
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = server;