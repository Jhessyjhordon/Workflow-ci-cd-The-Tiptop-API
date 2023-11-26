const db = require('../db');
const jwt = require('jsonwebtoken');
const Shop = require('../models/shopModel');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'dev'}` }); // Utilisez le fichier .env.dev par défaut

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const formattedToday = `${day}/${month}/${year}`;

const getShopById = async (req, res) => {
    const shopId = req.params.id;
  
    try {
      // Utilisez Sequelize pour rechercher la boutique par ID
      const shop = await Shop.findByPk(shopId);
  
      if (!shop) {
        return res.status(404).json({
          error: true,
          message: ["Boutique non trouvée"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Boutique trouvée'],
        shop: shop.toJSON() // Convertissez le modèle en objet JSON
      });
    } catch (error) {
      console.error('Erreur de requête Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la récupération de la boutique"]
      });
    }
  };

  const deleteShopById = async (req, res) => {
    const shopId = req.params.id;
  
    try {
      // Utilisez Sequelize pour supprimer la boutique par ID
      const deleteCount = await Shop.destroy({
        where: { id: shopId }
      });
  
      if (deleteCount === 0) {
        return res.status(404).json({
          error: true,
          message: ["Boutique non trouvée"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Boutique supprimée avec succès']
      });
    } catch (error) {
      console.error('Erreur de requête Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la suppression de la boutique"]
      });
    }
  };

  const getAllShops = async (req, res) => {
    try {
      // Utilisez Sequelize pour récupérer toutes les boutiques
      const shops = await Shop.findAll();
  
      if (shops.length === 0) {
        return res.status(404).json({
          error: true,
          message: ["Aucune boutique trouvée"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Liste des Boutiques'],
        shops
      });
    } catch (error) {
      console.error('Erreur de requête Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la récupération des Boutiques"]
      });
    }
  };

  const updateShopById = async (req, res) => {
    const shopId = req.params.id;
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour trouver la boutique à mettre à jour par son ID
      const shopToUpdate = await Shop.findByPk(shopId);
  
      if (!shopToUpdate) {
        return res.status(404).json({
          error: true,
          message: ["Boutique non trouvée"]
        });
      }
  
      // Effectuez la mise à jour des champs
      shopToUpdate.name = body.name;
      shopToUpdate.adress = body.adress;
      shopToUpdate.userId = body.userId;
      shopToUpdate.city = body.city;
      shopToUpdate.UpdatedAt = new Date();
  
      // Enregistrez les modifications dans la base de données
      await shopToUpdate.save();
  
      return res.status(200).json({
        error: false,
        message: ['Boutique mise à jour avec succès']
      });
    } catch (error) {
      console.error('Erreur de mise à jour de boutique avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la mise à jour de la boutique"]
      });
    }
  };

  const createShop = async (req, res) => {
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour créer un nouvel enregistrement de magasin
      const newShop = await Shop.create({
        name: body.name,
        adress: body.adress,
        city: body.city,
        userId: body.userId,
        createdAt: new Date(),
        UpdatedAt: new Date()
      });
  
      return res.status(201).json({
        error: false,
        message: ['Boutique enregistrée avec succès'],
        shop: newShop // Vous pouvez également renvoyer les données de la boutique créée si nécessaire
      });
    } catch (error) {
      console.error('Erreur lors de la création de la boutique avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de l'enregistrement de la boutique"]
      });
    }
  };

  const partialUpdateShopById = async (req, res) => {
    const shopId = req.params.id;
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour trouver le magasin à mettre à jour par son ID
      const shopToUpdate = await Shop.findByPk(shopId);
  
      if (!shopToUpdate) {
        return res.status(404).json({
          error: true,
          message: ["Boutique non trouvée"]
        });
      }
  
      for (const [key, value] of Object.entries(body)) {
        if (key in shopToUpdate) {
          shopToUpdate[key] = value;
        }
      }
  
      // Enregistrez les modifications dans la base de données
      await shopToUpdate.save();
  
      return res.status(200).json({
        error: false,
        message: ['Boutique mise à jour avec succès']
      });
    } catch (error) {
      console.error('Erreur de mise à jour de boutique avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la mise à jour de la boutique"]
      });
    }
  };
module.exports = { getShopById, deleteShopById, getAllShops, updateShopById, createShop,partialUpdateShopById};