
const express = require('express');
const router = express.Router();
const {getProductDetail,getAllStorageBySlugUrl ,relatedProduct} = require('../../../controler/client');
router.get('/product/:slug', getProductDetail);
router.get('/storage-by-slug/:slug', getAllStorageBySlugUrl);
router.get(`/:slug/related`,relatedProduct);
module.exports = router;
