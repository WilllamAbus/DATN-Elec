const express = require('express');
const router = express.Router();

const bestSelling = require('../../../controler/client/best-selling/best-selling.controller');


router.get('/best-selling',bestSelling.getBestSellingProducts );

module.exports = router;