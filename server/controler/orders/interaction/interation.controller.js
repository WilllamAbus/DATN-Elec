const interactionService = require('../../../services/interaction/interation.service'); // Import interaction service
const mongoose = require('mongoose'); 

const interactionController = {
  getPurchasedProducts: async (req, res) => {
    try {
      const { userId } = req.query; // Lấy userId từ URL
      const products = await interactionService.getPurchasedProducts(userId);
      res.status(200).json({
        title: "Lịch sử mua sắm",
        products,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await interactionService.getAllInteractions(
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const interaction = await interactionService.getInteractionById(id);
      res.status(200).json(interaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  softDel: async (req, res) => {
    try {
      const { id } = req.params;
      const interaction = await interactionService.softDeleteInteraction(id);
      res.status(200).json(interaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  restore: async (req, res) => {
    try {
      const { id } = req.params;
      const interaction = await interactionService.restoreInteraction(id);
      res.status(200).json(interaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getDeletedList: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await interactionService.getDeletedInteractions(
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  postInteractionView: async (req, res) => {
    try {
      const result = await interactionService.postInteractionsView(req.body);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: `Error creating interactions: ${error.message}` });
    }
  },

  
  postInteraction: async (req, res) => {
    try {
      const result = await interactionService.postInteractions(req.body);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: `Error creating interactions: ${error.message}` });
    }
  },
  postInteractionAuction: async (req, res) => {
    try {
      const result = await interactionService.postInteractionsAuction(req.body);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: `Error creating interactions: ${error.message}` });
    }
  },



  
};

module.exports = interactionController;
