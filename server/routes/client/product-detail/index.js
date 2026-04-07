
const express = require('express');
const router = express.Router();
const {getProductDetail,getAllStorageBySlugUrl,getAllProductVariantsByVariantPrice,relatedProduct} = require('../../../controler/client');
const middlewareController = require("../../../middleware/auth");
router.get('/product/:slug',middlewareController.getHeader,getProductDetail);
router.get('/storage-by-slug/:slug', getAllStorageBySlugUrl);
router.get('/product/same-price/:slug', getAllProductVariantsByVariantPrice);
router.get(`/:slug/related`,relatedProduct);
module.exports = router;
