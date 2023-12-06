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
 * /ticket/verify:
 *   post:
 *     summary: Vérifier le ticket 
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketVerification'
 *     responses:
 *       201:
 *         description: Le ticket a été créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketDetails'
 *       404:
 *        description: Ticket non trouvé ou détails introuvables
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TicketDetailsError'
 *       500:
 *         description: Une erreur de serveur s'est produite
 * /ticket/byuserid:
 *   get:
 *     summary: Vérifier le ticket par son user_id
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketVerification'
 *     responses:
 *       201:
 *         description: Le ticket a été créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketDetails'
 *       404:
 *        description: Ticket non trouvé ou détails introuvables
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TicketDetailsError'
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
 *           $ref: '#/components/schemas/TicketUpdate'
 *     responses:
 *       200:
 *         description: Ticket mis à jour avec succès
 *       400:
 *         description: Données de mise à jour invalides
 *       404:
 *         description: Ticket non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour du ticket
 *   patch:
 *     summary: Met à jour partielement un ticket par son ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: numTicket
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du ticket à mettre à jour
 *       - in: body
 *         name: ticket
 *         description: Nouvelles informations du ticket
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/TicketUpdate'
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
 *     TicketVerification:
 *       type: object
 *       required:
 *          - numTicket
 *       properties:
 *         numTicket:
 *           type: string
 *           description: Numéro du ticket
 *       example:
 *         numTicket: 3456
 *     TicketDetails:
 *       type: object
 *       properties:
 *         error:
 *           type: boolean
 *           example: false
 *         message:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Détail du ticket trouvé"]
 *         data:
 *           type: object
 *           properties:
 *             ticket:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 numTicket:
 *                   type: string
 *                   example: "A12345"
 *                 montantAchat:
 *                   type: number
 *                   example: 50.0
 *                 dateAchat:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-11-08T12:00:00Z"
 *                 state:
 *                   type: string
 *                   example: unchecked
 *                 user:
 *                   type: object
 *                   properties:
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                 batch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     type_lot:
 *                       type: string
 *                       example: "Type A"
 *                     valeur:
 *                       type: number
 *                       example: 100.0
 *                     description:
 *                       type: string
 *                       example: "Description du lot A"
 *     TicketDetailsError:
 *       type: object
 *       properties:
 *         error:
 *           type: boolean
 *           example: true
 *         message:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Ticket non trouvé"]
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
 *         numTicket: "12"
 *         montantTicket: 50
 *         dateAchat: "2023-08-18"
 *         gainAttribue: false
 *         state: unchecked
 *         statusGain: "En attente"
 *         batchId: 1
 *         userId: 1
 *     TicketUpdate:
 *       type: object
 *       required:
 *         - numTicket
 *         - montantTicket
 *         - dateAchat
 *         - gainAttribue
 *         - statusGain
 *         - batchId
 *         - state
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
 *         state:
 *           type: string
 *           description: Etat du gain check, unchecked, ...
 *         userId:
 *           type: number
 *           description: ID de l'utilisateur associé au ticket
 *       example:
 *         numTicket: "12"
 *         montantTicket: 50
 *         dateAchat: "2023-08-18"
 *         gainAttribue: false
 *         state: unchecked
 *         statusGain: "En attente"
 *         batchId: 1
 *         userId: 1
 */


router.get('/', ticketController.getAllTickets)
router.get('/:id', ticketMiddleware.validateTicketId(Validator.ticketIdSchema), ticketController.getTicketById)
router.delete('/:id', ticketMiddleware.validateTicketId(Validator.ticketIdSchema), ticketController.deleteTicketById)
router.put('/:id', ticketMiddleware.validateTicket(Validator.ticketPatchSchema), ticketController.updateTicketById)
router.patch('/:id', ticketMiddleware.validateTicket(Validator.ticketPatchSchema), ticketController.partialUpdateTicketById)
router.post('/', ticketMiddleware.validateTicket(Validator.ticketCreationSchema), ticketController.createTicket)
router.post('/verify', ticketMiddleware.validateTicketIdInPost(Validator.ticketNumTicketSchema), ticketController.verifyTicket)
router.get('/byuserid', ticketMiddleware.validateTicketIdInGet(Validator.ticketUserIdSchema), ticketController.verifyTicketUserId)

module.exports = router