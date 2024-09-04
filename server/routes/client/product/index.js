
const express = require('express');
const router = express.Router();
const { homeAllProduct, getID, getLimitProductClient } = require('../../../controler/client');
const { getProductsByCategory } = require('../../../controler/client');
router.get('/homeAllProduct', homeAllProduct);
router.get('/getLimitProductClient', getLimitProductClient);
router.get('/:id', getID);
router.get('/category/:categoryId', getProductsByCategory);
module.exports = router;
