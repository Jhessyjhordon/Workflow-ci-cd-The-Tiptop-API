// .mocharc.js
module.exports = {
    require: 'dotenv/config', // Pour charger les variables d'environnement avec dotenv
    recursive: true,
    reporter: 'mocha-sonarqube-reporter', // Reporter compatible pour Sonarqube
    reporterOptions:{
      output : 'unit-tests.xml',// default to ./xunit.xml
      useFullFilePath: 'true' // default to 'false'. Uses full test file paths in the report.
    },
    quiet: true,
    timeout: 10000,
    exit: true,
    file: ['./tests/setup.js'], // Exécutez le script de configuration avant les tests
    spec: ['./tests/*.test.js'] // Chemin vers les fichiers tests
  };
  