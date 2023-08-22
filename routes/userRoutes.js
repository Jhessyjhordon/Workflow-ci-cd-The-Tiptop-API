const express = require('express');
const router = express.Router();
const Validator = require('../utils/userValidators');

const userMiddleware = require('../middlewares/userMiddleware');
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour la gestion des utilisateurs
 * /user:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get('/', userController.getAllUsers)

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', userMiddleware.validateUserId(Validator.userIdSchema), userController.getUserById)

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par son ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la suppression de l'utilisateur
 */
router.delete('/:id', userMiddleware.validateUserId(Validator.userIdSchema), userController.deleteUserById)

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Met à jour un utilisateur par son ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *       - in: body
 *         name: user
 *         description: Nouvelles informations de l'utilisateur
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données de mise à jour invalides
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour de l'utilisateur
 */
router.put('/:id', userMiddleware.validateRegister(Validator.userSchema), userController.updateUserById)

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */
router.post('/', userMiddleware.validateRegister(Validator.userSchema), userController.UserRegister)

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       description: Informations de l'utilisateur à enregistrer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'  # Référence au schéma d'enregistrement utilisateur
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 *       400:
 *         description: Données d'enregistrement invalides
 *       500:
 *         description: Erreur lors de l'enregistrement de l'utilisateur
 */
router.post('/register', userMiddleware.validateRegister(Validator.userSchema), userController.UserRegister)

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       description: Informations de connexion de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials' 
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Échec de l'authentification
 *       500:
 *         description: Erreur lors de la connexion
 */
router.post('/login', userMiddleware.validateLogin(Validator.loginSchema), userController.UserLogin)


/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - login
 *         - pasword
 *       properties:
 *         login:
 *           type: string
 *           description: User login
 *         pasword:
 *           type: string
 *           description: user password
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - login
 *         - pasword
 *       properties:
 *         login:
 *           type: string
 *           description: User login
 *         pasword:
 *           type: string
 *           description: user password
 *     User:
 *       type: object
 *       required:
 *         - lastname
 *         - firstname
 *         - email
 *         - phone
 *         - password
 *       properties:
 *         lastname:
 *           type: string
 *           description: User lastname
 *         firstname:
 *           type: string
 *           description: user firstname
 *         email:
 *           type: string
 *           format: email
 *           description: user email
 *         phone:
 *           type: string
 *           description: User phone number
 *         password:
 *           type: string
 *           description: User password
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the user was added
 *       example:
 *         id: 45
 *         lastname: Toto
 *         firstname: Luc
 *         email: toto.luc@gmail.com
 *         phone: 0798456798
 *         password: vfvnoenvkneknvo875kfksFvFFFGHfJH455
 *         createdAt: 2020-03-10T04:05:06.157Z
 */
module.exports = router