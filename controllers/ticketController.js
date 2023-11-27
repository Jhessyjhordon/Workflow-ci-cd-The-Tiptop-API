const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const Batch = require('../models/batchModel');

const verifyTicket = async (req, res) => {
  const numTicket = req.body.numTicket;
  try {
    const ticket = await Ticket.findOne({ where: { numTicket: numTicket } });

    if (!ticket) {
      return res.status(404).json({
        error: true,
        message: ["Ticket non trouvé"]
      });
    }

    const user = await User.findByPk(ticket.user_id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: ["Ce Ticket n'appartient à aucun Client"]
      });
    }

    const batch = await Batch.findByPk(ticket.batch_id);

    if (!batch) {
      return res.status(404).json({
        error: true,
        message: ["Lot non trouvé"]
      });
    }

    ticket.state = "checked"
    ticket.save()

    const data = {
      "ticket": {
        "id": ticket.id,
        "numTicket": ticket.numTicket,
        "montantAchat": ticket.montantAchat,
        "dateAchat": ticket.dateAchat,
        "statusGain": ticket.statusGain,
        "state": ticket.state,
        "user": {
          "id": user.id,
          "lastname": user.lastname,
          "firstname": user.firstname,
          "email": user.email,
          "address": user.address,
        },
        "batch": {
          "id": batch.id,
          "type_lot": batch.type_lot,
          "valeur": batch.valeur,
          "description": batch.description
        }
      }
    };

    return res.status(201).json({
      error: false,
      message: ['Détail du ticket trouvé'],
      data: data
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des détails du ticket', error);
    return res.status(500).json({
      error: true,
      message: ["Erreur lors de la récupération des détails du ticket"]
    });
  }
};
const verifyTicketUserId = async (req, res) => {
  const userId = req.body.numTicket;
  try {
    const ticket = await Ticket.findOne({ where: { userId: userId } });

    if (!ticket) {
      return res.status(404).json({
        error: true,
        message: ["Ticket non trouvé"]
      });
    }

    const user = await User.findByPk(ticket.user_id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: ["Ce Ticket n'appartient à aucun Client"]
      });
    }

    const batch = await Batch.findByPk(ticket.batch_id);

    if (!batch) {
      return res.status(404).json({
        error: true,
        message: ["Lot non trouvé"]
      });
    }

    ticket.state = "checked"
    ticket.save()

    const data = {
      "ticket": {
        "id": ticket.id,
        "numTicket": ticket.numTicket,
        "montantAchat": ticket.montantAchat,
        "dateAchat": ticket.dateAchat,
        "statusGain": ticket.statusGain,
        "state": ticket.state,
        "user": {
          "id": user.id,
          "lastname": user.lastname,
          "firstname": user.firstname,
          "email": user.email,
          "address": user.address,
        },
        "batch": {
          "id": batch.id,
          "type_lot": batch.type_lot,
          "valeur": batch.valeur,
          "description": batch.description
        }
      }
    };

    return res.status(201).json({
      error: false,
      message: ['Détail du ticket trouvé'],
      data: data
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des détails du ticket', error);
    return res.status(500).json({
      error: true,
      message: ["Erreur lors de la récupération des détails du ticket"]
    });
  }
};


const createTicket = async (req, res) => {
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour créer un nouvel enregistrement de ticket
      const newTicket = await Ticket.create({
        numTicket: body.numTicket,
        montantTicket: body.montantTicket,
        dateAchat: body.dateAchat,
        gainAttribue: body.gainAttribue,
        // statusGain: body.statusGain,
        batchId: body.batchId,
        userId: body.userId,
        createAt: new Date(),
        updatedAt: new Date()
      });
  
      return res.status(201).json({
        error: false,
        message: ['Ticket enregistré avec succès'],
        ticket: newTicket
      });
  
    } catch (error) {
      console.error('Erreur lors de la création du ticket avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de l'enregistrement du ticket"]
      });
    }
  };

  const updateTicketById = async (req, res) => {
    const ticketId = req.params.id;
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour trouver le ticket à mettre à jour par son ID
      const ticketToUpdate = await Ticket.findByPk(ticketId);
  
      if (!ticketToUpdate) {
        return res.status(404).json({
          error: true,
          message: ["Ticket non trouvé"]
        });
      }
  
      // Effectuez la mise à jour des champs
      ticketToUpdate.numTicket = body.numTicket;
      ticketToUpdate.montantTicket = body.montantTicket;
      ticketToUpdate.dateAchat = body.dateAchat;
      ticketToUpdate.gainAttribue = body.gainAttribue;
      ticketToUpdate.statusGain = body.statusGain;
      ticketToUpdate.batchId = body.batchId;
      ticketToUpdate.userId = body.userId;
      ticketToUpdate.state = body.state;
      ticketToUpdate.updatedAt = new Date();
  
      // Enregistrez les modifications dans la base de données
      await ticketToUpdate.save();
  
      return res.status(200).json({
        error: false,
        message: ['Ticket mis à jour avec succès'],
        ticket: ticketToUpdate
      });
  
    } catch (error) {
      console.error('Erreur lors de la mise à jour du ticket avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la mise à jour du ticket"]
      });
    }
  };

  const deleteTicketById = async (req, res) => {
    const ticketId = req.params.id;
  
    try {
      // Utilisez Sequelize pour supprimer le ticket par ID
      const deleteCount = await Ticket.destroy({
        where: { id: ticketId }
      });
  
      if (deleteCount === 0) {
        return res.status(404).json({
          error: true,
          message: ["Ticket non trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Ticket supprimé avec succès']
      });
  
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la suppression du ticket"]
      });
    }
  };

  const getAllTickets = async (req, res) => {
    try {
      // Utilisez Sequelize pour récupérer tous les tickets
      const tickets = await Ticket.findAll();
  
      if (tickets.length === 0) {
        return res.status(404).json({
          error: true,
          message: ["Aucun ticket trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Liste des Tickets'],
        tickets
      });
  
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la récupération des Tickets"]
      });
    }
  };

  const getTicketById = async (req, res) => {
    const ticketId = req.params.id;
  
    try {
      // Utilisez Sequelize pour rechercher le ticket par ID
      const ticket = await Ticket.findByPk(ticketId);
  
      if (!ticket) {
        return res.status(404).json({
          error: true,
          message: ["Ticket non trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Ticket trouvé'],
        ticket
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du ticket avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la récupération du ticket"]
      });
    }
  };

  const partialUpdateTicketById = async (req, res) => {
    const ticketId = req.params.id;
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour trouver le ticket à mettre à jour par son ID
      const ticketToUpdate = await Ticket.findByPk(ticketId);
  
      if (!ticketToUpdate) {
        return res.status(404).json({
          error: true,
          message: ["Ticket non trouvé"]
        });
      }
  
      for (const [key, value] of Object.entries(body)) {
        if (key in ticketToUpdate) {
          ticketToUpdate[key] = value;
        }
      }
  
      // Enregistrez les modifications dans la base de données
      await ticketToUpdate.save();
  
      return res.status(200).json({
        error: false,
        message: ['Ticket mis à jour avec succès']
      });
    } catch (error) {
      console.error('Erreur de mise à jour de ticket avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la mise à jour du ticket"]
      });
    }
  };

module.exports = { createTicket, updateTicketById, deleteTicketById, getAllTickets, getTicketById, partialUpdateTicketById, verifyTicket, verifyTicketUserId};
