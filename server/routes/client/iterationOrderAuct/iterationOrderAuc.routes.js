// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();

const iteractionOrderAuController = require('../../../controler/orders/auctions/iterationOrder.controller')
const middlewareController = require("../../../middleware/auth");
// Route to create a payment link
router.get('/allOrder', iteractionOrderAuController.getOrderByUser);
router.get('/shippStateOrderAuc', iteractionOrderAuController.getShippingOrderByUser);
router.get('/reciveStateOrderAuc', iteractionOrderAuController.getReciveOrderByUser);
router.get('/completStateOrderAuc', iteractionOrderAuController.getCompleteOrderByUser);
router.patch('/received/soft-delete',middlewareController.verifyToken, iteractionOrderAuController.softDeleteReceivedOrders);
router.put('/updateStatus/:orderId', middlewareController.verifyTokenAdminAuth, iteractionOrderAuController.updateorderStatus)
module.exports = router;