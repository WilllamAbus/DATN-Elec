const express = require('express');
const router = express.Router();
const upload = require('../../../middleware/multer.middle');
const { add,selectbrand,selectSupplier,selectDiscount,selectProductFormat,selectConditionShopping } = require('../../../controler/admin/product_v2');

router.post('/add', upload.array('image'), add);
router.get('/selectbrand',selectbrand);
router.get('/selectsupplier',selectSupplier);
router.get('/selectdiscount',selectDiscount);
router.get('/selectProductFormat',selectProductFormat);
router.get('/selectConditionSP',selectConditionShopping);


module.exports = router;
