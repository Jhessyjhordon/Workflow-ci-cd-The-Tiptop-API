require('dotenv').config();
const TicketModel = require('../models/ticketModel');
const UserModel = require('../models/userModel');
const BatchModel = require('../models/batchModel');
const TicketNumGenerator = require('../services/ticketNumeroGenerator');
const sequelizeService = require('../services/sequelizeService');

const findTicketById = async (id) => {
  return await TicketModel.findByPk(id);
};

const findUserById = async (id) => {
  return await UserModel.findByPk(id);
};

const findBatchById = async (id) => {
  return await BatchModel.findByPk(id);
};

const verifyTicket = async (req, res) => {
  const numTicket = req.body.numTicket;

  try {
      const ticket = await TicketModel.findOne({ where: { numTicket: numTicket } });

      if (!ticket) {
          return res.status(404).json({
              error: true,
              message: ["Ticket non trouvé"]
          });
      }

      const user = await findUserById(ticket.user_id);

      if (!user) {
          return res.status(404).json({
              error: true,
              message: ["Ce Ticket n'appartient à aucun Client"]
          });
      }

      const batch = await findBatchById(ticket.batch_id);

      if (!batch) {
          return res.status(404).json({
              error: true,
              message: ["Lot non trouvé"]
          });
      }

      ticket.state = "checked";
      await ticket.save();

      const data = {
          ticket: {
              id: ticket.id,
              numTicket: ticket.numTicket,
              montantAchat: ticket.montantAchat,
              dateAchat: ticket.dateAchat,
              statusGain: ticket.statusGain,
              state: ticket.state,
              user: {
                  id: user.id,
                  lastname: user.lastname,
                  firstname: user.firstname,
                  email: user.email,
                  address: user.address,
              },
              batch: {
                  id: batch.id,
                  type_lot: batch.type_lot,
                  valeur: batch.valeur,
                  description: batch.description
              }
          }
      };

      return res.status(201).json({
          error: false,
          message: ['Détail du ticket trouvé'],
          data: data
      });

  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération des détails du ticket");
  }
};

const verifyTicketUserId = async (req, res) => {
  const userId = req.query.userId;

  try {
      const tickets = await TicketModel.findAll({ where: { user_id: userId } });

      if (!tickets || tickets.length === 0) {
          return res.status(404).json({
              error: true,
              message: ["Aucun ticket trouvé"]
          });
      }

      const userPromises = tickets.map(ticket => findUserById(ticket.user_id));
      const users = await Promise.all(userPromises);

      if (users.some(user => !user)) {
          return res.status(404).json({
              error: true,
              message: ["Certains tickets n'appartiennent à aucun Client"]
          });
      }

      const batchesPromises = tickets.map(ticket => findBatchById(ticket.batch_id));
      const batches = await Promise.all(batchesPromises);

      if (batches.some(batch => !batch)) {
          return res.status(404).json({
              error: true,
              message: ["Certains tickets n'ont aucun lot lié"]
          });
      }

      const data = tickets.map((ticket, index) => ({
          id: ticket.id,
          numTicket: ticket.numTicket,
          montantAchat: ticket.montantAchat,
          dateAchat: ticket.dateAchat,
          statusGain: ticket.statusGain,
          state: "checked",
          user: {
              id: users[index].id,
              lastname: users[index].lastname,
              firstname: users[index].firstname,
              email: users[index].email,
              address: users[index].address,
          },
          batch: {
              id: batches[index].id,
              type_lot: batches[index].type_lot,
              valeur: batches[index].valeur,
              description: batches[index].description
          }
      }));

      return res.status(201).json({
          error: false,
          message: ['Détails des tickets trouvés'],
          data: data
      });

  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération des détails des tickets");
  }
};

const createTicket = async (req, res) => {
  const body = req.body;
  const numTicket = TicketNumGenerator.generateUniqueTicketNumber();
  try {
      const newTicket = await TicketModel.create({
          numTicket: numTicket,
          montantTicket: body.montantAchat,
          dateAchat: new Date(),
          gainAttribue: 0.00,
          batch_id: body.batchId,
          user_id: body.userId,
          createAt: new Date(),
          updatedAt: new Date()
      });

      return res.status(201).json({
          error: false,
          message: ['Ticket enregistré avec succès'],
          ticket: newTicket
      });

  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de l'enregistrement du ticket");
  }
};

const updateTicketById = async (req, res) => {
  const ticketId = req.params.id;
  const body = req.body;

  try {
      const ticketToUpdate = await findTicketById(ticketId);

      if (!ticketToUpdate) {
          return res.status(404).json({
              error: true,
              message: ["Ticket non trouvé"]
          });
      }

      await ticketToUpdate.update({
          numTicket: body.numTicket,
          montantTicket: body.montantTicket,
          dateAchat: body.dateAchat,
          gainAttribue: body.gainAttribue,
          statusGain: body.statusGain,
          batchId: body.batchId,
          userId: body.userId,
          state: body.state,
          updatedAt: new Date()
      });

      return res.status(200).json({
          error: false,
          message: ['Ticket mis à jour avec succès'],
          ticket: ticketToUpdate
      });

  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la mise à jour du ticket");
  }
};

const deleteTicketById = async (req, res) => {
  const ticketId = req.params.id;

  try {
      const deleteCount = await TicketModel.destroy({
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
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la suppression du ticket")
    };
};

const getAllTickets = async (req, res) => {
  try {
    // Utilisez Sequelize pour récupérer tous les tickets
    const tickets = await TicketModel.findAll();

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
    return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération des Tickets")
  }
};

const getTicketById = async (req, res) => {
  const ticketId = req.params.id;

  try {
    // Utilisez Sequelize pour rechercher le ticket par ID
    const ticket = await findTicketById(ticketId);

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
    return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération du ticket")
  }
};

const partialUpdateTicketById = async (req, res) => {
  const ticketId = req.params.id;
  const body = req.body;

  try {
    // Utilisez Sequelize pour trouver le ticket à mettre à jour par son ID
    const ticketToUpdate = await findTicketById(ticketId);

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
    return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la mise à jour du ticket")
  }
};

module.exports = { createTicket, updateTicketById, deleteTicketById, getAllTickets, getTicketById, partialUpdateTicketById, verifyTicket, verifyTicketUserId };
