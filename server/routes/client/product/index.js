const express = require('express');
const router = express.Router();
const {homeAllProduct } = require('../../../controler/client');
router.get('/homeAllProduct',homeAllProduct);


module.exports = router;
