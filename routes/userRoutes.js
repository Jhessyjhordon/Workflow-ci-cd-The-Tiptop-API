const express = require('express');
const router = express.Router();
const passport = require('passport');
const Validator = require('../utils/userValidators');

const userMiddleware = require('../middlewares/userMiddleware');
const userController = require('../controllers/userController');



/**
 * @swagger
 * /user/upload:
 *   post:
 *     summary: Télécharge la photo de profil de l'utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichier téléchargé avec succès
 *       400:
 *         description: Aucun fichier sélectionné ou erreur lors du téléchargement du fichier
 *       500:
 *         description: Erreur serveur lors du téléchargement
 */
router.post('/upload', userController.uploadPhoto);

/**
 * @swagger
 * /user/email/newsletter?newsletter=1&mode=?:
 *   get:
 *     summary: Get user emails by newsletter status
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: newsletter
 *         schema:
 *           type: boolean
 *         description: Filter users by newsletter status (true/false)
 *     responses:
 *       200:
 *         description: List of user emails
 */
router.get('/email/newsletter', userController.getUserEmailsByNewsletter);

/**
 * @swagger
 * /user/shortcut/customers/datails:
 *   get:
 *     summary: Get shortcut customer details
 *     tags: 
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user details
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 firstname: John
 *                 lastname: Doe
 *                 photoPath: /photos/johndoe.jpg
 *               - id: 2
 *                 firstname: Jane
 *                 lastname: Smith
 *                 photoPath: /photos/janesmith.jpg
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 *       500:
 *         description: Internal Server Error
 */
router.get('/shortcut/customers/datails',userMiddleware.checkIfUserToken ,userMiddleware.checkIfUserIsAdmin, userController.getShortcutCustomerDetails);

/**
 * @swagger
 * /user/email/newsletter:
 *   put:
 *     summary: Unsubscribe user from newsletter
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: User email to unsubscribe from the newsletter
 *         example: 'user@example.com'
 *     responses:
 *       200:
 *         description: User successfully unsubscribed
 *       404:
 *         description: User not found
 */
router.put('/email/newsletter', userController.unsubscribeFromNewsletter);

/**
 * @swagger
 * /user/auth/google:
 *   get:
 *     summary: Authentification via Google
 *     description: Redirige l'utilisateur vers la page d'authentification Google pour autoriser l'accès à l'adresse e-mail.
 *     tags: [Users]
 *     responses:
 *       '302':
 *         description: Redirige l'utilisateur vers la page d'authentification Google
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.GoogleAuth);

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
router.get('/', userMiddleware.checkIfUserToken ,userMiddleware.checkIfUserIsEmployee,userController.getAllUsers)

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour la gestion des utilisateurs
 * /user/role/customer:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs ayant le rôle CLIENT
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get('/role/customer', userMiddleware.checkIfUserToken ,userMiddleware.checkIfUserIsEmployeeOrAdmin,userController.getAllUsersByRoleClient)

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour la gestion des utilisateurs
 * /user/role/employee:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs ayant le rôle EMPLOYEE
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get('/role/employee', userMiddleware.checkIfUserToken ,userMiddleware.checkIfUserIsEmployeeOrAdmin,userController.getAllUsersByRoleEmployee)

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
router.get('/:id',userMiddleware.checkIfUserToken, userMiddleware.validateUserId(Validator.userIdSchema), userController.getUserById)

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
router.delete('/:id', userMiddleware.checkIfUserToken, userMiddleware.checkIfUserIsAdmin, userMiddleware.validateUserId(Validator.userIdSchema), userController.deleteUserById)

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
router.put('/:id', userMiddleware.checkIfUserToken, userMiddleware.validateRegister(Validator.userSchema), userController.updateUserById)

/**
 * @swagger
 * /user:
 *   post:
 *     summary: création de son compte par l'utilisateur
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
router.post('/', userMiddleware.validateUserCreation(Validator.userSchema), userController.UserCreation)

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Met à jour partiellement un utilisateur par son ID
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
 *         description: Nouvelles informations partielles de l'utilisateur
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données de mise à jour partielles invalides
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour de l'utilisateur
 */
router.patch('/:id', userMiddleware.checkIfUserToken, userMiddleware.validatePatchUser(Validator.userIdSchema), userController.partialUpdateUserById)

/**
 * @swagger
 * /user/delete/account/{id}:
 *   delete:
 *     summary: Supprime le compte utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la suppression de l'utilisateur
 */
router.delete('/delete/account/:id',
                userMiddleware.checkIfUserToken, 
                userMiddleware.validateUserId(Validator.userIdSchema) ,
                userController.deleateAccount)


/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     tags: [Users]
 *     security: [] 
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
router.post('/register', userMiddleware.checkIfUserToken,userMiddleware.validateRegister(Validator.userRegisterSchema), userController.UserRegister)

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Users]
 *     security: [] 
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
 * /user/confirm/{token}:
 *   get:
 *     summary: Confirme un utilisateur avec un token de confirmation
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmation de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur confirmé avec succès
 *       400:
 *         description: Lien de confirmation invalide ou expiré
 *       500:
 *         description: Erreur lors de la confirmation de l'utilisateur
 */
router.get('/confirm/:token', userController.UserConfirme)

/**
 * @swagger
 * /user/email/unsubscribe/newsletter:
 *   put:
 *     summary: Unsubscribe user from newsletter
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: User email to unsubscribe from the newsletter
 *         example: 'user@example.com'
 *     responses:
 *       200:
 *         description: User successfully unsubscribed
 *       404:
 *         description: User not found
 */
router.put('/email/unsubscribe/newsletter',userMiddleware.checkIfUserToken, userController.unsubscribeFromNewsletter);


/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstname
 *         - lastname
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: user password
 *         firstname:
 *           type: string
 *           description: user firstname
 *         lastname:
 *           type: string
 *           description: user lastname
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User login
 *         password:
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
 *         - role
 *         - birthDate
 *         - address
 *       properties:
 *         lastname:
 *           type: string
 *           description: User lastname
 *         firstname:
 *           type: string
 *           description: user firstname
 *         address:
 *           type: string
 *           description: user address
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
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the user was added
 *         birthDate:
 *           type: string
 *           format: date
 *           description: User birth Date
 *         role:
 *          type: string
 *          description: user role
 *       example:
 *         id: 45
 *         lastname: Toto
 *         firstname: Luc
 *         email: toto.luc@gmail.com
 *         phone: 0798456798
 *         password: vfvnoenvkneknvo875kfksFvFFFGHfJH455
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 *         birthDate: 1990-01-17
 *         role: customer
 *         address: 15 rue Babo, 91101 ville X
 *         photoUrl: uploads/profilePhoto-1635321342000.png
 */
module.exports = router