const ShopModel = require('../models/shopModel');
const sequelizeService = require('../services/sequelizeService');
require('dotenv').config();

const getShopById = async (req, res) => {
  const shopId = req.params.id;

  try {
      const shop = await ShopModel.findByPk(shopId);

      if (!shop) {
          return res.status(404).json({
              error: true,
              message: ["Boutique non trouvée"]
          });
      }

      return res.status(200).json({
          error: false,
          message: ['Boutique trouvée'],
          shop: shop.toJSON()
      });
  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération de la boutique");
  }
};

const deleteShopById = async (req, res) => {
  const shopId = req.params.id;

  try {
      const deleteCount = await ShopModel.destroy({
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
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la suppression de la boutique");
  }
};

const getAllShops = async (req, res) => {
  try {
      const shops = await ShopModel.findAll();

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
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la récupération des Boutiques");
  }
};

const updateShopById = async (req, res) => {
  const shopId = req.params.id;
  const body = req.body;

  try {
      const shopToUpdate = await ShopModel.findByPk(shopId);

      if (!shopToUpdate) {
          return res.status(404).json({
              error: true,
              message: ["Boutique non trouvée"]
          });
      }

      await shopToUpdate.update({
          name: body.name,
          adress: body.adress,
          userId: body.userId,
          city: body.city,
          UpdatedAt: new Date()
      });

      return res.status(200).json({
          error: false,
          message: ['Boutique mise à jour avec succès']
      });
  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la mise à jour de la boutique");
  }
};

const createShop = async (req, res) => {
  const body = req.body;

  try {
      const newShop = await ShopModel.create({
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
          shop: newShop
      });
  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de l'enregistrement de la boutique");
  }
};

const partialUpdateShopById = async (req, res) => {
  const shopId = req.params.id;
  const body = req.body;

  try {
      const shopToUpdate = await ShopModel.findByPk(shopId);

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

      await shopToUpdate.save();

      return res.status(200).json({
          error: false,
          message: ['Boutique mise à jour avec succès']
      });
  } catch (error) {
      return sequelizeService.handleSequelizeError(res, error, "Une erreur est survenue lors de la mise à jour de la boutique");
  }
};
module.exports = { getShopById, deleteShopById, getAllShops, updateShopById, createShop,partialUpdateShopById};