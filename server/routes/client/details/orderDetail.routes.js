const express = require('express');
const router = express.Router();
const orderDetailController = require('../../../controler/orders/auctions/orderDetail.controller');
const middlewareController = require("../../../middleware/auth");
// Get paginated order details
router.get('/order-details', orderDetailController.getPaginatedOrderDetails);

// Soft delete an order detail
router.patch('/order-details/soft-delete/:id',middlewareController.verifyTokenAdminAuth, orderDetailController.softDeleteOrderDetail);

// Restore a soft-deleted order detail
router.patch('/order-details/restore/:id',middlewareController.verifyTokenAdminAuth, orderDetailController.restoreOrderDetail);

// Get soft-deleted order details with pagination
router.get('/order-details/soft-deleted', orderDetailController.getSoftDeletedOrderDetails);

// Get order detail with images by ID
router.get('/order-details/:id', orderDetailController.getOrderDetailWithImagesById);

module.exports = router;
