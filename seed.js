const db = require('./db');
const fs = require('fs');
const path = require('path');

const seedFiles = fs.readdirSync('./seeds');
const connection = db.connection();

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
