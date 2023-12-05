const JackpotModel = require('../models/jackpotModel')
const sequelizeService = require('../services/sequelizeService');
require('dotenv').config();


const getAllJackpots = async (req, res) => {

    try {
        const Jackpots = await JackpotModel.findAll();

        if (Jackpots.length === 0) {
            return res.status(404).json({
              error: true,
              message: ["Aucun lot trouvé"]
            });
        }
        
        return res.status(200).json({
            error: false,
            message: ['Liste des jackpots'],
            jackpots: Jackpots
        });

    } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération des jackpots");
    }
};

const getJackpotById = async (req, res) => {
    const jackpotId = req.params.id;
  
    try {
      // Utilisez Sequelize pour rechercher le jackpot par son ID
      const jackpot = await JackpotModel.findByPk(jackpotId);
  
      if (!jackpot) {
        return res.status(404).json({
          error: true,
          message: ["Jackpot non trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Jackpot trouvé'],
        jackpot: jackpot
      });
  
    } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération du jackpot");
    }
  };

  const updateJackpotById = async (req, res) => {
    const jackpotId = req.params.id;
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour mettre à jour le jackpot par son ID
      const [updatedRowsCount] = await JackpotModel.update(
        {
          date_tirage: body.date_tirage,
          userId: body.userId,
          updatedAt: new Date()
        },
        {
          where: {
            id: jackpotId
          }
        }
      );
  
      if (updatedRowsCount === 0) {
        return res.status(404).json({
          error: true,
          message: ["Jackpot non trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Jackpot mis à jour avec succès']
      });
  
    } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la mise à jour du jackpot");
    }
  };

  const createJackpot = async (req, res) => {
    const body = req.body;
  
    try {
      // Utilisez Sequelize pour créer un nouveau jackpot
      const newJackpot = await JackpotModel.create({
        dateClientGagnant: body.dateClientGagnant,
        userId: body.userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      return res.status(201).json({
        error: false,
        message: ['Jackpot enregistré avec succès'],
        jackpot: newJackpot
      });
  
    } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de l'enregistrement du jackpot");
    }
  };

  // Définissez la fonction deleteJackpotById avec Sequelize
const deleteJackpotById = async (req, res) => {
    const jackpotId = req.params.id;
  
    try {
      // Utilisez Sequelize pour supprimer le jackpot par son ID
      const deleteCount = await JackpotModel.destroy({
        where: {
          id: jackpotId
        }
      });
  
      if (deleteCount === 0) {
        return res.status(404).json({
          error: true,
          message: ["Jackpot non trouvé"]
        });
      }
  
      return res.status(200).json({
        error: false,
        message: ['Jackpot supprimé avec succès']
      });
  
    } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la suppression du jackpot");
    }
  };

module.exports = { getAllJackpots, getJackpotById, updateJackpotById, createJackpot, deleteJackpotById };
