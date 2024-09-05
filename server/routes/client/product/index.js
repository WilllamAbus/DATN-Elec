
const express = require('express');
const router = express.Router();
const { homeAllProduct, getID, getLimitProductClient,shopping,auction,upView,search } = require('../../../controler/client');
const { getProductsByCategory } = require('../../../controler/client');
router.get('/homeAllProduct', homeAllProduct);
router.get('/getLimitProductClient', getLimitProductClient);
router.get('/:id', getID);
router.get('/category/:categoryId', getProductsByCategory);
router.get(`/shopping/:product_format`,shopping);
router.get(`/auction/:product_format`,auction);
router.put(`/upView/:id`,upView);
router.get(`/search/:keyword`,search);
module.exports = router;
