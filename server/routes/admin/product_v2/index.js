const express = require('express');
const router = express.Router();
const upload = require('../../../middleware/multer.middle');
const {
   list,
   add,
   softDelete,
   selectbrand,
   selectSupplier,
   selectDiscount,
   selectProductFormat,
   selectConditionShopping,
   selectCategories } = require('../../../controler/admin/product_v2');
router.get('/list',list);
router.post('/add', upload.array('image'), add);
router.get('/softDelete',softDelete);
router.get('/selectbrand',selectbrand);
router.get('/selectsupplier',selectSupplier);
router.get('/selectdiscount',selectDiscount);
router.get('/selectProductFormat',selectProductFormat);
router.get('/selectConditionSP',selectConditionShopping);
router.get('/selectCategories',selectCategories);


module.exports = router;
