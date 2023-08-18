const db = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Récupérer la date du jour au format jour/mois/année
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const formattedToday = `${day}/${month}/${year}`;

// Contrôleur d'inscription d'utilisateur
const UserRegister = async (req, res) => {
    const body = req.body;

    const selectQuery = "SELECT * FROM user WHERE email = ?;";
    const insertQuery = "INSERT INTO user (firstname, lastname, email, phone, password, CreatedAt, UpdatedAt, IsVerify, role) VALUES (?,?,?,?,?,?,?,?,?);";

    const connect = db.connection();

    try {
        // Vérification de l'existence de l'email
        const results = await new Promise((resolve, reject) => {
            connect.execute(selectQuery, [body.email], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        if (results.length > 0) {
            return res.status(409).json({
                error: true,
                message: ["L'utilisateur a déjà un compte"]
            });
        }

        const hash = await argon2.hash(body.password);
        const values = [body.firstname, body.lastname, body.email, body.phone, hash, formattedToday, formattedToday, false, 'customer'];
        
        const insertResult = await new Promise((resolve, reject) => {
            connect.execute(insertQuery, values, function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Utilisateur inscrit avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de l'inscription"]
        });
    } finally {
        db.disconnect(connect);
    }
};

// Contrôleur de connexion d'utilisateur
const UserLogin = async (req, res) => {
    const body = req.body;

    const selectQuery = "SELECT * FROM user WHERE email = ?;";
    const connect = db.connection();

    try {
        // Vérification de l'existence de l'email
        const results = await new Promise((resolve, reject) => {
            connect.execute(selectQuery, [body.email], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        if (results.length === 0 || !(await argon2.verify(results[0].password, body.password))) {
            return res.status(401).json({
                error: true,
                message: ["Mot de passe ou utilisateur incorrect"]
            });
        }

        const token = jwt.sign({ email: results[0].email }, process.env.JWT_SECRET_KEY);

        return res.status(200).json({
            error: false,
            message: ['Connexion réussie'],
            jwt: token
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la connexion"]
        });
    } finally {
        db.disconnect(connect);
    }
};

module.exports = { UserLogin, UserRegister };