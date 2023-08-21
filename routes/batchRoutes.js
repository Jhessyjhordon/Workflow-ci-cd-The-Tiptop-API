const express = require('express');
const router = express.Router();
const Validator = require('../utils/batchValidators');

const batchMiddleware = require('../middlewares/batchMiddleware');
const batchController = require('../controllers/batchController');

/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: API pour la gestion des Lots
 * /batch:
 *   get:
 *     summary: Récupère la liste de tous les lots
 *     tags: [Batches]
 *     responses:
 *       200:
 *         description: Liste des lots récupérée avec succès
 * 
 *   post:
 *     summary: Crée un nouveau lot
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Batch'
 *     responses:
 *       201:
 *         description: Lot créé avec succès.
 * 
 * /batch/{id}:
 *   get:
 *     summary: Récupère un lot par son ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du lot
 *     responses:
 *       200:
 *         description: Lot récupéré avec succès
 *       404:
 *         description: Lot non trouvé
 * 
 *   delete:
 *     summary: Supprime un lot par son ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du lot à supprimer
 *     responses:
 *       204:
 *         description: Lot supprimé avec succès
 *       404:
 *         description: Lot non trouvé
 * 
 *   put:
 *     summary: Met à jour un lot par son ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du lot à mettre à jour
 *       - in: body
 *         name: batch
 *         description: Nouvelles informations du lot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Batch'
 *     responses:
 *       200:
 *         description: Lot mis à jour avec succès
 *       400:
 *         description: Données de mise à jour invalides
 *       404:
 *         description: Lot non trouvé
 * 
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       required:
 *         - valeur
 *         - description
 *         - pourcentage_gagnant
 *         - idUser
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         valeur:
 *           type: number
 *           description: valeur du lot
 *         description:
 *           type: string
 *           description: description du lot
 *         pourcentage_gagnant:
 *           type: number
 *           description: pourcentage gagnant du lot
 *         idUser:
 *           type: number
 *           description: ID de l'utilisateur associé au lot
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date de création du lot
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Date de mise à jour du lot
 *       example:
 *         valeur: 100
 *         description: Lot de valeur 100
 *         pourcentage_gagnant: 10
 *         idUser: 123
 *         createdAt: 2023-08-18T10:00:00Z
 *         updatedAt: 2023-08-18T10:30:00Z
 */


router.get('/', batchController.getAllBatches)
router.get('/:id', batchMiddleware.validateBatchId(Validator.batchIdSchema), batchController.getBatchById)
router.delete('/:id', batchMiddleware.validateBatchId(Validator.batchIdSchema), batchController.deleteBatchById)
router.put('/:id', batchMiddleware.validateBatch(Validator.batchSchema), batchController.updateBatchById)
router.post('/', batchMiddleware.validateBatch(Validator.batchSchema), batchController.createBatch)

module.exports = router