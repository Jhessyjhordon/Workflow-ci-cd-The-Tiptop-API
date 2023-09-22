const express = require('express');
const router = express.Router();
const Validator = require('../utils/jackpotValidators');

const jackpotMiddleware = require('../middlewares/jackpotMiddleware');
const jackpotController = require('../controllers/jackpotController');

/**
 * @swagger
 * tags:
 *   name: Jackpots
 *   description: API pour la gestion des Jackpots
 * /jackpot:
 *   get:
 *     summary: Récupère la liste de tous les jackpots
 *     tags: [Jackpots]
 *     responses:
 *       200:
 *         description: Liste des jackpots récupérée avec succès
 * 
 *   post:
 *     summary: Crée un nouveau jackpot
 *     tags: [Jackpots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jackpot'
 *     responses:
 *       201:
 *         description: Le jackpot a été créé avec succès.
 *       500:
 *         description: Erreur interne du serveur
 * 
 * /jackpot/{id}:
 *   get:
 *     summary: Récupère un jackpot par son ID
 *     tags: [Jackpots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du jackpot
 *     responses:
 *       200:
 *         description: Jackpot récupéré avec succès
 *       404:
 *         description: Jackpot non trouvé
 * 
 *   delete:
 *     summary: Supprime un jackpot par son ID
 *     tags: [Jackpots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du jackpot à supprimer
 *     responses:
 *       204:
 *         description: Jackpot supprimé avec succès
 *       404:
 *         description: Jackpot non trouvé
 *       500:
 *         description: Erreur lors de la suppression du jackpot
 * 
 *   put:
 *     summary: Met à jour un jackpot par son ID
 *     tags: [Jackpots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du jackpot à mettre à jour
 *       - in: body
 *         name: jackpot
 *         description: Nouvelles informations du jackpot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Jackpot'
 *     responses:
 *       200:
 *         description: Jackpot mis à jour avec succès
 *       400:
 *         description: Données de mise à jour invalides
 *       404:
 *         description: Jackpot non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour du jackpot
 * 
 * components:
 *   schemas:
 *     Jackpot:
 *       type: object
 *       required:
 *         - dateClientGagnant
 *         - idUser
 *       properties:
 *         dateClientGagnant:
 *           type: string
 *           format: date-time
 *           description: Date du gain du client
 *         idUser:
 *           type: number
 *           description: ID de l'utilisateur gagnant
 *       example:
 *         dateClientGagnant: 2023-08-18T12:00:00Z
 *         idUser: 123
 */


router.get('/', jackpotController.getAllJackpots)
router.get('/:id', jackpotMiddleware.validateJackpotId(Validator.validateJackpotId), jackpotController.getJackpotById)
router.delete('/:id', jackpotMiddleware.validateJackpotId(Validator.validateJackpotId), jackpotController.deleteJackpotById)
router.put('/:id', jackpotMiddleware.validateJackpotId(Validator.jackpotchema), jackpotController.updateJackpotById)
router.post('/', jackpotMiddleware.validateJackpot(Validator.jackpotchema), jackpotController.createJackpot)

module.exports = router