'use strict'

const detailService = require('../../../services/orders/orderHq/detail.service');

const orderDetailController = {
    getPaginatedOrderDetails : async (req, res) => {
        const { page = 1, limit = 10, includeSoftDeleted = false } = req.query;
        try {
          const { orderDetails, totalOrderDetails } = await detailService.getPaginatedOrderDetails(
            parseInt(page),
            parseInt(limit),
            includeSoftDeleted === 'true'
          );
          res.json({ orderDetails, totalOrderDetails });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

      softDeleteOrderDetail : async (req, res) => {
        const { id } = req.params;
        try {
          const result = await detailService.softDeleteOrderDetail(id);
          res.json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

      restoreOrderDetail : async (req, res) => {
        const { id } = req.params;
        try {
          const result = await detailService.restoreOrderDetail(id);
          res.json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

      getSoftDeletedOrderDetails : async (req, res) => {
        const { page = 1, limit = 5 } = req.query;
        try {
          const { softDeletedOrderDetails, totalSoftDeletedOrderDetails } = await detailService.getSoftDeletedOrderDetails(
            parseInt(page),
            parseInt(limit)
          );
          res.json({ softDeletedOrderDetails, totalSoftDeletedOrderDetails });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

      getOrderDetailWithImagesById : async (req, res) => {
        const { id } = req.params;
        try {
          const orderDetail = await detailService.getOrderDetailWithImagesById(id);
          if (orderDetail) {
            res.json(orderDetail);
          } else {
            res.status(404).json({ error: 'Order detail not found' });
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
}

module.exports = orderDetailController