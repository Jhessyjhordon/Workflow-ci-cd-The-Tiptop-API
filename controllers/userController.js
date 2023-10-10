const db = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Assurez-vous que le chemin est correct

require('dotenv').config();

// Récupérer la date du jour au format jour/mois/année
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const formattedToday = `${day}/${month}/${year}`;

// Contrôleur d'inscription d'utilisateur
const UserRegister = async (req, res) => {
    const body = req.body;

    try {
        // Vérification de l'existence de l'email
        const existingUser = await User.findOne({ where: { email: body.email } });

        if (existingUser) {
            return res.status(409).json({
                error: true,
                message: ["L'utilisateur a déjà un compte"]
            });
        }

        const hash = await argon2.hash(body.password);
        const newUser = await User.create({
            firstName: body.firstname,
            lastName: body.lastname,
            email: body.email,
            phone: body.phone,
            password: hash,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            isVerify: false,
            role: 'customer' // Vous pouvez modifier le rôle selon vos besoins
        });

        return res.status(200).json({
            error: false,
            message: ['Utilisateur inscrit avec succès']
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription avec Sequelize :', error);
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de l'inscription"]
        });
    }
};


// Contrôleur de connexion d'utilisateur
const UserLogin = async (req, res) => {
    const body = req.body;

    try {
        // Vérification de l'existence de l'email et récupération de l'utilisateur
        const user = await User.findOne({ where: { email: body.email } });

        if (!user || !(await argon2.verify(user.password, body.password))) {
            return res.status(401).json({
                error: true,
                message: ["Mot de passe ou utilisateur incorrect"]
            });
        }

        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET_KEY);

        return res.status(200).json({
            error: false,
            message: ['Connexion réussie'],
            jwt: token
        });

    } catch (error) {
        console.error('Erreur lors de la connexion avec Sequelize :', error);
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la connexion"]
        });
    }
};

// Contrôleur pour la route GET '/'
const getAllUsers = async (req, res) => {
    const token = req.headers.authorization; // Récupérer le token de l'en-tête

    try {
        // Vérifier la présence du token
        if (!token) {
            return res.status(401).json({
                error: true,
                message: ["Accès non autorisé"] // Token manquant
            });
        }

        // Décoder le token pour obtenir les informations utilisateur
        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);

        // Vérifier le rôle de l'utilisateur (assumons que le rôle est stocké dans decodedToken.role)
        if (decodedToken.role !== 'employee') {
            return res.status(403).json({
                error: true,
                message: ["Accès refusé"]
            });
        }

        // Récupérer la liste des utilisateurs
        const users = await User.findAll();

        return res.status(200).json({
            error: false,
            message: ['Liste des utilisateurs'],
            users
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                message: ["Veillez vous reconnecter"] // Token expiré
            });
        }
        console.error('Erreur lors de la récupération des utilisateurs avec Sequelize :', error);
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération des utilisateurs"]
        });
    }
};


// Contrôleur pour la route DELETE '/:id'


// Contrôleur pour la route PUT '/:id'
const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const body = req.body;

    try {
        // Rechercher l'utilisateur par ID
        const userToUpdate = await User.findByPk(userId);

        if (!userToUpdate) {
            return res.status(404).json({
                error: true,
                message: ["Utilisateur non trouvé"]
            });
        }

        // Mettre à jour les champs de l'utilisateur
        userToUpdate.firstName = body.firstname;
        userToUpdate.lastName = body.lastname;
        userToUpdate.email = body.email;
        userToUpdate.phone = body.phone;

        // Enregistrer les modifications dans la base de données
        await userToUpdate.save();

        return res.status(200).json({
            error: false,
            message: ['Utilisateur mis à jour avec succès']
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur avec Sequelize :', error);
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la mise à jour de l'utilisateur"]
        });
    }
};

// Contrôleur pour la route GET '/:id'
const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        // Rechercher l'utilisateur par ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                error: true,
                message: ["Utilisateur non trouvé"]
            });
        }

        return res.status(200).json({
            error: false,
            message: ['Utilisateur trouvé'],
            user
        });

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur avec Sequelize :', error);
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la récupération de l'utilisateur"]
        });
    }
};


const deleteUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        // Rechercher l'utilisateur par ID
        const userToDelete = await User.findByPk(userId);

        if (!userToDelete) {
            return res.status(404).json({
                error: true,
                message: ["Utilisateur non trouvé"]
            });
        }

        // Supprimer l'utilisateur de la base de données
        await userToDelete.destroy();

        return res.status(200).json({
            error: false,
            message: ['Utilisateur supprimé avec succès']
        });

    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur avec Sequelize :', error);
        return res.status(500).json({
            error: true,
            message: ["Une erreur est survenue lors de la suppression de l'utilisateur"]
        });
    }
};
module.exports = { UserLogin, UserRegister, getUserById, deleteUserById, updateUserById, getAllUsers};
