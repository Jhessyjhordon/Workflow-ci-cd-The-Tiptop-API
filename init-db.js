const db = require('./db');
const fs = require('fs');
const path = require('path');

const connection = db.connection();

// Chemins vers vos scripts SQL
const createTablesScriptPath = path.join(__dirname, 'scripts', 'create-tables.sql');
const seedsScriptPath = path.join(__dirname, 'scripts', 'seeds.sql');

// Exécution des scripts SQL
const createTablesScript = fs.readFileSync(createTablesScriptPath, 'utf8');
const seedsScript = fs.readFileSync(seedsScriptPath, 'utf8');

connection.query(createTablesScript, (err) => {
    if (err) throw err;
    console.log('Tables created successfully');
    
    connection.query(seedsScript, (err) => {
        if (err) throw err;
        console.log('Data seeded successfully');
        db.disconnect(connection);
    });
});
