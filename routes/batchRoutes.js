const express = require('express');
const router = express.Router();
const Validator = require('../utils/batchValidators');

const batchMiddleware = require('../middlewares/batchMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
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
 * /batch/verify:
 *   post:
 *     summary: Verifier un lot
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyBatch'
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
 *   patch:
 *     summary: Met à jour partiellement un lot par son ID
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
 *         description: Nouvelles informations partielles du lot
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/BatchPatchSchema'
 *     responses:
 *       200:
 *         description: Lot mis à jour avec succès
 *       400:
 *         description: Données de mise à jour partielles invalides
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
 * /batch/retrieve/byuserid:
 *   get:
 *     summary: Récupère la liste des lots par ID d'utilisateur
 *     tags: [Batches]
 *     responses:
 *       200:
 *         description: Lots récupérés avec succès
 *         content:
 *           application/json:
 *             example:
 *               - valeur: 100
 *                 description: "Lot de valeur 100"
 *                 type_lot: "Infuseur à thé"
 *                 pourcentage_gagnant: 10
 *                 employee_id: 1
 *       404:
 *         description: Utilisateur non trouvé ou pas de lots associés
 * /batch/shortcuted/details:
 *   get:
 *     summary: Obtenir les lots raccourcis
 *     tags: [Batches]
 *     responses:
 *       200:
 *         description: Liste des lots raccourcis
 *         content:
 *           application/json:
 *             example:
 *               - id: 100
 *                 type_lot: "Infuseur à thé"
 *               - id: 101
 *                 type_lot: "Coffret de thé"
 * 
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       required:
 *         - valeur
 *         - description
 *         - type_lot
 *         - pourcentage_gagnant
 *         - employee_id
 *       properties:
 *         valeur:
 *           type: number
 *           description: valeur du lot
 *         description:
 *           type: string
 *           description: description du lot
 *         type_lot:
 *           type: string
 *           description: typa auquel appartient le lot
 *         pourcentage_gagnant:
 *           type: number
 *           description: pourcentage gagnant du lot
 *         employee_id:
 *           type: number
 *           description: ID de l'utilisateur associé au lot
 *       example:
 *         valeur: 100
 *         description: Lot de valeur 100
 *         type_lot: Infuseur à thé
 *         pourcentage_gagnant: 10
 *         employee_id: 1
 *     VerifyBatch:
 *       type: object
 *       required:
 *         - batchId
 *       properties:
 *         batchId:
 *           type: number
 *           description: id du lot
 *     BatchPatchSchema:
 *       type: object
 *       properties:
 *         valeur:
 *           type: number
 *           description: valeur du lot
 *         description:
 *           type: string
 *           description: description du lot
 *         type_lot:
 *           type: string
 *           description: typa auquel appartient le lot
 *         pourcentage_gagnant:
 *           type: number
 *           description: pourcentage gagnant du lot
 *         employee_id:
 *           type: number
 *           description: ID de l'utilisateur associé au lot
 *       example:
 *         valeur: 10
 *         employee_id: 3
 */


router.get('/', batchController.getAllBatches)
router.get('/shortcuted/details', userMiddleware.checkIfUserToken, userMiddleware.checkIfUserIsAdmin, batchController.getShortcutBatchs)
router.get('/:id', batchMiddleware.validateBatchId(Validator.batchIdSchema), batchController.getBatchById)
router.get('/retrieve/byuserid', userMiddleware.checkIfUserToken, batchController.getBatchByUserId)
router.delete('/:id', batchMiddleware.validateBatchId(Validator.batchIdSchema), batchController.deleteBatchById)
router.put('/:id', batchMiddleware.validateBatch(Validator.batchSchema), batchController.updateBatchById)
router.patch('/:id', batchMiddleware.validateBatchPatch(Validator.batchPatchSchema), batchController.partialUpdateBatchById);
router.post('/', batchMiddleware.validateBatch(Validator.batchSchema), batchController.createBatch)
router.post('/verify', batchMiddleware.validateBatchId(Validator.batchIdSchema), batchController.verifyBatch)

module.exports = router