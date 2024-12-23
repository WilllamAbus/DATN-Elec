const express = require('express');
const router = express.Router();
const { getProductDetailAuction, createOneUpdateBidAuction } = require('../../../controler/client');
const middlewareController = require("../../../middleware/auth");

// Cập nhật router POST
router.post('/create-one-update-bid-auction/:slug', middlewareController.getHeader, createOneUpdateBidAuction);

router.get('/product-auction/:slug', middlewareController.getHeader, getProductDetailAuction);

module.exports = router;
