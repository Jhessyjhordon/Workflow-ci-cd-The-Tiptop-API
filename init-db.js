const db = require('./db');
const fs = require('fs');
const path = require('path');

const connection = db.connection();

// Chemin vers le script de création des tables SQL
const createTablesScriptPath = path.join(__dirname, 'scripts', 'create-tables.sql');

// Exécution du script de création des tables
const createTablesScript = fs.readFileSync(createTablesScriptPath, 'utf8');

connection.query(createTablesScript, (err) => {
    if (err) throw err;
    console.log('Tables created successfully');

    // Appel au script de seed en JavaScript
    const seedFiles = fs.readdirSync('./seeds');

    seedFiles.sort(); // Tri des fichiers par ordre alphabétique (qui correspond à l'ordre numérique)

    seedFiles.forEach(async (seedFile) => {
        const seedPath = path.join('./seeds', seedFile);
        const seedFunction = require(seedPath);

        try {
            await seedFunction(connection);
            console.log(`Seed script ${seedFile} executed successfully`);
        } catch (error) {
            console.error(`Error executing seed script ${seedFile}: ${error.message}`);
        }
    });

    db.disconnect(connection);
});
