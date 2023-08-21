const db = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const today = new Date();
const formattedToday = today.toISOString();

const getAllJackpots = async (req, res) => {
    const selectQuery = "SELECT * FROM jackpot;";
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
            message: ['Liste des jackpots'],
            jackpots: results
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération des jackpots"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const getJackpotById = async (req, res) => {
    const jackpotId = req.params.id;
    const selectQuery = "SELECT * FROM jackpot WHERE id = ?;";
    const connect = db.connection();

    try {
        const results = await new Promise((resolve, reject) => {
            connect.execute(selectQuery, [jackpotId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).json({
                error: true,
                message: ["Jackpot non trouvé"]
            });
        }

        return res.status(200).json({
            error: false,
            message: ['Jackpot trouvé'],
            jackpot: results[0]
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération du jackpot"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const updateJackpotById = async (req, res) => {
    const jackpotId = req.params.id;
    const body = req.body;
    const updateQuery = "UPDATE jackpot SET dateClientGagnant = ?, idUser = ?, updatedAt = ? WHERE id = ? ;";
    const connect = db.connection();

    try {
        const updateResult = await new Promise((resolve, reject) => {
            connect.execute(updateQuery, [body.dateClientGagnant, body.idUser, formattedToday, jackpotId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Jackpot mis à jour avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la mise à jour du jackpot"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const createJackpot = async (req, res) => {
    const body = req.body;
    const insertQuery = "INSERT INTO jackpot (dateClientGagnant, idUser, createdAt, updatedAt) VALUES (?, ?, ?, ?);";
    const connect = db.connection();

    try {
        const insertResult = await new Promise((resolve, reject) => {
            connect.execute(insertQuery, [body.dateClientGagnant, body.idUser, formattedToday, formattedToday], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(201).json({
            error: false,
            message: ['Jackpot enregistré avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de l'enregistrement du jackpot"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const deleteJackpotById = async (req, res) => {
    const jackpotId = req.params.id;
    const deleteQuery = "DELETE FROM jackpot WHERE id = ?;";
    const connect = db.connection();

    try {
        const deleteResult = await new Promise((resolve, reject) => {
            connect.execute(deleteQuery, [jackpotId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Jackpot supprimé avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la suppression du jackpot"]
        });
    } finally {
        db.disconnect(connect);
    }
};

module.exports = { getAllJackpots, getJackpotById, updateJackpotById, createJackpot, deleteJackpotById };
