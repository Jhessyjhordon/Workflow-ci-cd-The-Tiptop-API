const express = require('express');
const router = express.Router();
const Validator = require('../utils/shopValidators');

const shopMiddleware = require('../middlewares/shopMiddleware');
const shopController = require('../controllers/shopController');

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: API pour la gestion des Boutiques
 * /shop:
 *   get:
 *     summary: Récupère la liste de toutes les boutiques
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: Liste des boutiques récupérée avec succès
 * 
 *   post:
 *     summary: Create a new shop
 *     tags: [Shops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shop'
 *     responses:
 *       200:
 *         description: The created shop.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shop'
 *       500:
 *         description: Some server error
 * 
 * /shop/{id}:
 *   get:
 *     summary: Récupère un boutique par son ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la boutique
 *     responses:
 *       200:
 *         description: Boutique récupérée avec succès
 *       404:
 *         description: Boutique non trouvée
 * 
 *   delete:
 *     summary: Supprime une boutique par son ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la boutique à supprimer
 *     responses:
 *       204:
 *         description: Boutique supprimée avec succès
 *       404:
 *         description: Boutique non trouvée
 *       500:
 *         description: Erreur lors de la suppression de la boutique
 * 
 *   put:
 *     summary: Met à jour une boutique par son ID
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la boutique à mettre à jour
 *       - in: body
 *         name: user
 *         description: Nouvelles informations de la boutique
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Shop'
 *     responses:
 *       200:
 *         description: Boutique mis à jour avec succès
 *       400:
 *         description: Données de mise à jour invalides
 *       404:
 *         description: Boutique non trouvée
 *       500:
 *         description: Erreur lors de la mise à jour de l'utilisateur
 * 
 * 
 * components:
 *   schemas:
 *     Shop:
 *       type: object
 *       required:
 *         - name
 *         - adress
 *         - createdAt
 *         - updatedAt
 *         - employeeId
 *         - city
 *       properties:
 *         name:
 *           type: string
 *           description: shop name
 *         adress:
 *           type: string
 *           description: shop address
 *         UpdatedAt:
 *           type: string
 *           format: date
 *           description: The date the shop was updated
 *         employeeId:
 *           type: string
 *           description: shop id manager
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the shop was added
 *         city:
 *           type: string
 *           description: shop city
 *       example:
 *         name: la boutique
 *         adress: 101 rue du Po, 93200  
 *         UpdatedAt: 2020-03-10T04:05:06.157Z
 *         employeeId: 6798
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         city: Montreuil
 */
router.get('/', shopController.getAllShops)
router.get('/:id', shopMiddleware.validateShopId(Validator.shopIdSchema), shopController.getShopById)
router.delete('/:id', shopMiddleware.validateShopId(Validator.shopIdSchema), shopController.deleteShopById)
router.put('/:id', shopMiddleware.validateShop(Validator.shopSchema), shopController.updateShopById)
router.post('/', shopMiddleware.validateShop(Validator.shopSchema), shopController.ShopCreation)


module.exports = router