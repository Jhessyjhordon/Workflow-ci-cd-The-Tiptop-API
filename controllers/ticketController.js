const db = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const formattedToday = `${day}/${month}/${year}`;

const createTicket = async (req, res) => {
    const body = req.body;
    const insertQuery = "INSERT INTO ticket (numTicket, montantTicket, dateAchat, gainAttribue, statusGain, batchId, userId, createAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"; 
    const connect = db.connection();

    try {
        const insertResult = await new Promise((resolve, reject) => {
            connect.execute(insertQuery, [body.numTicket, body.montantTicket, body.dateAchat, body.gainAttribue, body.statusGain, body.batchId, body.userId, formattedToday, formattedToday], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(201).json({
            error: false,
            message: ['Ticket enregistré avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de l'enregistrement du ticket"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const updateTicketById = async (req, res) => {
    const ticketId = req.params.id;
    const body = req.body;
    const updateQuery = "UPDATE ticket SET numTicket = ?, montantTicket = ?, dateAchat = ?, gainAttribue = ?, statusGain = ?, batchId = ?, userId = ?, updatedAt=? WHERE id = ?;";
    const connect = db.connection();

    try {
        const updateResult = await new Promise((resolve, reject) => {
            connect.execute(updateQuery, [body.numTicket, body.montantTicket, body.dateAchat, body.gainAttribue, body.statusGain, body.batchId, body.userId, ticketId, formattedToday], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Ticket mis à jour avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la mise à jour du ticket"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const deleteTicketById = async (req, res) => {
    const ticketId = req.params.id;
    const deleteQuery = "DELETE FROM ticket WHERE id = ?;";
    const connect = db.connection();

    try {
        const deleteResult = await new Promise((resolve, reject) => {
            connect.execute(deleteQuery, [ticketId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        return res.status(200).json({
            error: false,
            message: ['Ticket supprimé avec succès']
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la suppression du ticket"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const getAllTickets = async (req, res) => {
    const selectQuery = "SELECT * FROM ticket;";
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
            message: ['Liste des Tickets'],
            tickets: results
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération des Tickets"]
        });
    } finally {
        db.disconnect(connect);
    }
};

const getTicketById = async (req, res) => {
    const ticketId = req.params.id;
    const selectQuery = "SELECT * FROM ticket WHERE id = ?;";
    const connect = db.connection();

    try {
        const results = await new Promise((resolve, reject) => {
            connect.execute(selectQuery, [ticketId], function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });

        if (results.length === 0) {
            return res.status(404).json({
                error: true,
                message: ["Ticket non trouvé"]
            });
        }

        return res.status(200).json({
            error: false,
            message: ['Ticket trouvé'],
            ticket: results[0]
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération du ticket"]
        });
    } finally {
        db.disconnect(connect);
    }
};

module.exports = { createTicket, updateTicketById, deleteTicketById, getAllTickets, getTicketById };
