
const express = require('express');
const router = express.Router();
const {getProductDetailAuction} = require('../../../controler/client');
const middlewareController = require("../../../middleware/auth");
router.get('/product-auction/:slug',middlewareController.getHeader,getProductDetailAuction);

module.exports = router;
