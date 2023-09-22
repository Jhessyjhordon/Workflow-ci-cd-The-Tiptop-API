const db = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Batch = require('../models/batchModel')
require('dotenv').config();


const getBatchById = async (req, res) => {
    const batchId = req.params.id;

  try {
    // Utilisez Sequelize pour rechercher le lot par ID
    const batch = await Batch.findByPk(batchId);

    if (!batch) {
      return res.status(404).json({
        error: true,
        message: ["Lot non trouvé"]
      });
    }

    return res.status(200).json({
      error: false,
      message: ['Lot trouvé'],
      batch: batch.toJSON() // Convertissez le modèle en objet JSON
    });
  } catch (error) {
    console.error('Erreur de requête Sequelize :', error);
    return res.status(500).json({
      error: true,
      message: ["Une erreur est survenue lors de la récupération du lot"]
    });
  }
};

// Définissez la fonction deleteBatchById avec Sequelize
const deleteBatchById = async (req, res) => {
    const batchId = req.params.id;
  
    try {
      // Utilisez Sequelize pour supprimer le lot par ID
      const deleteCount = await Batch.destroy({
        where: { id: batchId }
      });
  
      if (deleteCount === 0) {
        return res.status(404).json({
          error: true,
          message: ["Lot non trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Lot supprimé avec succès']
      });
    } catch (error) {
      console.error('Erreur de requête Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la suppression du lot"]
      });
    }
  };

// Définissez la fonction getAllBatches avec Sequelize
const getAllBatches = async (req, res) => {
    try {
      // Utilisez Sequelize pour récupérer tous les lots
      const batches = await Batch.findAll();
  
      if (batches.length === 0) {
        return res.status(404).json({
          error: true,
          message: ["Aucun lot trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Liste des Lots'],
        batches
      });
    } catch (error) {
      console.error('Erreur de requête Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la récupération des Lots"]
      });
    }
  };

// Définissez la fonction updateBatchById avec Sequelize
const updateBatchById = async (req, res) => {
    const batchId = req.params.id;
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour trouver le lot à mettre à jour par son ID
      const batchToUpdate = await Batch.findByPk(batchId);
  
      if (!batchToUpdate) {
        return res.status(404).json({
          error: true,
          message: ["Lot non trouvé"]
        });
      }
  
      // Effectuez la mise à jour des champs
      batchToUpdate.valeur = body.valeur;
      batchToUpdate.description = body.description;
      batchToUpdate.pourcentage_gagnant = body.pourcentage_gagnant;
      batchToUpdate.userId = body.userId;
      batchToUpdate.type_lot = body.type_lot;
  
      // Enregistrez les modifications dans la base de données
      await batchToUpdate.save();
  
      return res.status(200).json({
        error: false,
        message: ['Lot mis à jour avec succès']
      });
    } catch (error) {
      console.error('Erreur de mise à jour de lot avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de la mise à jour du lot"]
      });
    }   
  };

// Définissez la fonction createBatch avec Sequelize
const createBatch = async (req, res) => {
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour créer un nouvel enregistrement Batch
      const newBatch = await Batch.create({
        valeur: body.valeur,
        description: body.description,
        pourcentage_gagnant: body.pourcentage_gagnant,
        userId: body.userId,
        type_lot: body.type_lot,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      return res.status(201).json({
        error: false,
        message: ['Lot enregistré avec succès'],
        batch: newBatch // Vous pouvez également renvoyer les données du lot créé si nécessaire
      });
    } catch (error) {
      console.error('Erreur lors de la création du lot avec Sequelize :', error);
      return res.status(500).json({
        error: true,
        message: ["Une erreur est survenue lors de l'enregistrement du lot"]
      });
    }
  };


module.exports = {getBatchById, deleteBatchById, getAllBatches, updateBatchById, createBatch};