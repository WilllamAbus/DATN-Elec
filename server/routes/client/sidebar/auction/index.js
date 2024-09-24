
const express = require('express');
const router = express.Router();
const { getAllBrandPageAuction,getALLConditionShopping,getAllProductVariants} = require('../../../../controler/client');

router.get('/get-all-brand', getAllBrandPageAuction);
router.get('/get-all-condition-shopping', getALLConditionShopping);
router.get('/get-all-variant',getAllProductVariants);
module.exports = router;
