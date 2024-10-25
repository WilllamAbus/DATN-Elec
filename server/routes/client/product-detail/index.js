
const express = require('express');
const router = express.Router();
const {getProductDetail,getAllStorageBySlugUrl} = require('../../../controler/client');
router.get('/product/:slug', getProductDetail);
router.get('/storage-by-slug/:slug', getAllStorageBySlugUrl);
module.exports = router;
