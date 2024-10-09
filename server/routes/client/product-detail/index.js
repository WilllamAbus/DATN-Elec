
const express = require('express');
const router = express.Router();
const {getProductDetail} = require('../../../controler/client');
router.get('/product/:slug', getProductDetail);
module.exports = router;
