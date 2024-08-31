const express = require('express');
const router = express.Router();
const {
   add,
   getAllProductController,
   getAllSupplierController,
   list,
 } = require('../../../controler/admin/inboundshipments');
router.post('/add', add);
router.get('/list',list);
router.get('/getProduct',getAllProductController);
router.get('/getSupplier',getAllSupplierController);


module.exports = router;
