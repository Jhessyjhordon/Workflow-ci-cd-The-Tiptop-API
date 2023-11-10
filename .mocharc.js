// .mocharc.js
module.exports = {
    require: 'dotenv/config', // Pour charger les variables d'environnement avec dotenv
    recursive: true,
    reporter: 'spec',
    timeout: 10000,
    exit: true,
    file: ['/var/jenkins_home/workspace/the-tiptop-api-2_dev/the-tiptop-api-dev/tests/setup.js', '/var/jenkins_home/workspace/the-tiptop-api-2_dev/the-tiptop-api-dev/tests/*.test.js'], // Exécutez le script de configuration avant les tests
  };
  