const express = require('express');
const router = express.Router();
const Validator = require('../utils/ticketValidators');

const ticketMiddleware = require('../middlewares/ticketMiddleware');
const ticketController = require('../controllers/ticketController');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: API pour la gestion des Tickets
 * /ticket:
 *   get:
 *     summary: Récupère la liste de tous les tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Liste des tickets récupérée avec succès
 * 
 *   post:
 *     summary: Crée un nouveau ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Le ticket a été créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Une erreur de serveur s'est produite
 * 
 * /ticket/{id}:
 *   get:
 *     summary: Récupère un ticket par son ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du ticket
 *     responses:
 *       200:
 *         description: Ticket récupéré avec succès
 *       404:
 *         description: Ticket non trouvé
 * 
 *   delete:
 *     summary: Supprime un ticket par son ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du ticket à supprimer
 *     responses:
 *       204:
 *         description: Ticket supprimé avec succès
 *       404:
 *         description: Ticket non trouvé
 *       500:
 *         description: Erreur lors de la suppression du ticket
 * 
 *   put:
 *     summary: Met à jour un ticket par son ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du ticket à mettre à jour
 *       - in: body
 *         name: ticket
 *         description: Nouvelles informations du ticket
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket mis à jour avec succès
 *       400:
 *         description: Données de mise à jour invalides
 *       404:
 *         description: Ticket non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour du ticket
 * 
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - numTicket
 *         - montantTicket
 *         - dateAchat
 *         - gainAttribue
 *         - statusGain
 *         - batchId
 *         - userId
 *       properties:
 *         numTicket:
 *           type: string
 *           description: Numéro du ticket
 *         montantTicket:
 *           type: number
 *           description: Montant du ticket
 *         dateAchat:
 *           type: string
 *           format: date
 *           description: Date d'achat du ticket
 *         gainAttribue:
 *           type: boolean
 *           description: Indicateur de gain attribué
 *         statusGain:
 *           type: string
 *           description: Statut du gain
 *         batchId:
 *           type: number
 *           description: ID du lot associé au ticket
 *         userId:
 *           type: number
 *           description: ID de l'utilisateur associé au ticket
 *       example:
 *         numTicket: "T12345"
 *         montantTicket: 50
 *         dateAchat: "2023-08-18"
 *         gainAttribue: false
 *         statusGain: "En attente"
 *         batchId: 1
 *         userId: 123
 */


router.get('/', ticketController.getAllTickets)
router.get('/:id', ticketMiddleware.validateTicketId(Validator.ticketIdSchema), ticketController.getTicketById)
router.delete('/:id', ticketMiddleware.validateTicketId(Validator.ticketIdSchema), ticketController.deleteTicketById)
router.put('/:id', ticketMiddleware.validateTicket(Validator.ticketSchema), ticketController.updateTicketById)
router.post('/', ticketMiddleware.validateTicket(Validator.ticketSchema), ticketController.createTicket)

module.exports = router