const db = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const formattedToday = `${day}/${month}/${year}`;

const getShopById = async (req, res) => {
    const shopId = req.params.id;
    const selectQuery = "SELECT * FROM shop WHERE id = ?;";
    const connect = db.connection();

    try {
        const results = await new Promise((resolve, reject) => {
            connect.execute(selectQuery, [shopId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).json({
                error: true,
                message: ["Boutique non trouvée"]
            });
        }

        return res.status(200).json({
            error: false,
            message: ['Boutique trouvée'],
            shop: results[0]
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération de la boutique"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const deleteShopById = async (req, res) => {
    const shopId = req.params.id;
    const deleteQuery = "DELETE FROM shop WHERE id = ?;";
    const connect = db.connection();

    try {
        const deleteResult = await new Promise((resolve, reject) => {
            connect.execute(deleteQuery, [shopId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Boutique supprimée avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la suppression de la boutique"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const getAllShops = async (req, res) => {
    const selectQuery = "SELECT * FROM shop;";
    const connect = db.connection();

    try {
        const results = await new Promise((resolve, reject) => {
            connect.execute(selectQuery, function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Liste des Boutiques'],
            users: results
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération des Boutiques"]
        });
    } finally {
        db.disconnect(connect);
    }
};

updateShopById = async (req, res) => {
    const shopId = req.params.id;
    const body = req.body;
    const updateQuery = "UPDATE shop SET name = ?, adress = ?, employeeId = ?,  city = ?, UpdatedAt=?, WHERE id = ? ;";
    const connect = db.connection();

    try {
        const updateResult = await new Promise((resolve, reject) => {
            connect.execute(updateQuery, [body.name, body.adress, body.employeeId, body.city, formattedToday, shopId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Boutique mise à jour avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la mise à jour de la boutique"]
        });
    } finally {
        db.disconnect(connect);
    }
};

createShop = async (req, res) => {
    const body = req.body;
    const insertQuery = "INSERT INTO shop (name, adress, employeeId, city, userId, createdAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?);"; 
    const connect = db.connection();

    try {
        const insertResult = await new Promise((resolve, reject) => {
            connect.execute(insertQuery, [body.name, body.adress, body.employeeId, body.city, body.userId, formattedToday, formattedToday], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(201).json({
            error: false,
            message: ['Boutique enregistrée avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de l'enregistrement de la boutique"]
        });
    } finally {
        db.disconnect(connect);
    }
};

module.exports = { getShopById, deleteShopById, getAllShops, updateShopById, createShop};