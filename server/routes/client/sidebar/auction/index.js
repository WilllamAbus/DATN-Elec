
const express = require('express');
const router = express.Router();
const { getAllBrandPageAuction} = require('../../../../controler/client');
router.get('/get-all-brand', getAllBrandPageAuction);

module.exports = router;
