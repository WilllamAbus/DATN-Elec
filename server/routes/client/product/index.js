
const express = require('express');
const router = express.Router();
const { homeAllProduct,listPageAuction,resetFilter, getID, getLimitProductClient,shopping,auction,upView,search, recommendations} = require('../../../controler/client');
const { getProductsByCategory,relatedProduct } = require('../../../controler/client');
const middlewareController = require("../../../middleware/auth");




router.get('/homeAllProduct', homeAllProduct);
router.get('/auction-product', listPageAuction);
router.get('/reset-filter', resetFilter);
router.get('/getLimitProductClient', getLimitProductClient);
router.get('/:id', getID);
router.get('/category/:slug', getProductsByCategory);
router.get(`/shopping/:product_format`,shopping);   
router.get(`/auction/:product_format`,auction);
router.put(`/upView/:id`,upView);
router.get(`/search/:keyword`,search);
router.get('/recommendation', middlewareController.verifyToken , recommendations)



 

module.exports = router;
