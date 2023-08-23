const db = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const formattedToday = `${day}/${month}/${year}`;

const getBatchById = async (req, res) => {
    const batchId = req.params.id;
    const selectQuery = "SELECT * FROM batch WHERE id = ?;";
    const connect = db.connection();

    try {
        const results = await new Promise((resolve, reject) => {
            connect.execute(selectQuery, [batchId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).json({
                error: true,
                message: ["Lot non trouvé"]
            });
        }

        return res.status(200).json({
            error: false,
            message: ['Lot trouvé'],
            batch: results[0]
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération du lot"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const deleteBatchById = async (req, res) => {
    const batchId = req.params.id;
    const deleteQuery = "DELETE FROM batch WHERE id = ?;";
    const connect = db.connection();

    try {
        const deleteResult = await new Promise((resolve, reject) => {
            connect.execute(deleteQuery, [batchId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Lot supprimé avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la suppression du lot"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const getAllBatches = async (req, res) => {
    const selectQuery = "SELECT * FROM batch;";
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
            message: ['Liste des Lots'],
            batches: results
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération des Lots"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const updateBatchById = async (req, res) => {
    const batchId = req.params.id;
    const body = req.body;
    const updateQuery = "UPDATE batch SET valeur = ?, description = ?, pourcentage_gagnant = ?, userId = ?, type_lot=?, updatedAt = ? WHERE id = ? ;";
    const formattedToday = new Date().toISOString();
    const connect = db.connection();

    try {
        const updateResult = await new Promise((resolve, reject) => {
            connect.execute(updateQuery, [body.valeur, body.description, body.pourcentage_gagnant, body.userId, body.type_lot, formattedToday, batchId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Lot mis à jour avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la mise à jour du lot"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const createBatch = async (req, res) => {
    const body = req.body;
    const insertQuery = "INSERT INTO batch (valeur, description, pourcentage_gagnant, userId, type_lot, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);"; 
    const formattedToday = new Date().toISOString();
    const connect = db.connection();

    try {
        const insertResult = await new Promise((resolve, reject) => {
            connect.execute(insertQuery, [body.valeur, body.description, body.pourcentage_gagnant, body.userId, body.type_lot, formattedToday, formattedToday], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(201).json({
            error: false,
            message: ['Lot enregistré avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de l'enregistrement du lot"]
        });
    } finally {
        db.disconnect(connect);
    }
};


module.exports = {getBatchById, deleteBatchById, getAllBatches, updateBatchById, createBatch};