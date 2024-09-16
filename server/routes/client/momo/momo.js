// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const createPaymentController = require('../../../controler/orders/auctions/paymentMoMo.controller')

// Route to create a payment link
router.post('/create', createPaymentController.createPayment);

module.exports = router;
