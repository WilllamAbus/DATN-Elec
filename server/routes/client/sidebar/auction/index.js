
const express = require('express');
const router = express.Router();
const { getAllBrandPageAuction,getALLConditionShopping} = require('../../../../controler/client');
router.get('/get-all-brand', getAllBrandPageAuction);
router.get('/get-all-condition-shopping', getALLConditionShopping);
module.exports = router;
