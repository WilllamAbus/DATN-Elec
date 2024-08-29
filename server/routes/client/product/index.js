const express = require('express');
const router = express.Router();
const {homeAllProduct,getID } = require('../../../controler/client');
router.get('/homeAllProduct',homeAllProduct);
router.get('/:id',getID)
module.exports = router;
