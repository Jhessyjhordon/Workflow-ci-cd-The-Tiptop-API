const app = require('./index');
const express = require('express')

// Définir un port par défaut
const DEFAULT_PORT = 4000;
const PORT = process.env.PORT || DEFAULT_PORT;

// Démarre le serveur uniquement si nous ne sommes pas en train de tester
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
} else {
  // En mode test, on n'écoute pas sur un port réel
  console.log('Serveur en mode test, en attente de requêtes via supertest...');
  // Exporter l'application pour les tests sans démarrer le serveur
  module.exports = app;
}