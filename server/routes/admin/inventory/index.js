const express = require('express');
const router = express.Router();
const {
   listInventory,
   listInventoryV2,
   updateQuantityShelf,
   updateQuantityShelfProductV2,
   getProductsInInventoryController,
   getProductV2InInventoryController,
   search,
   searchV2,
   getOne,
   getOneV2,
   checkInventory
 } = require('../../../controler/admin/inventoryController');
router.get('/list',listInventory);
router.get('/listV2',listInventoryV2);

router.post('/update-quantity-shelf', updateQuantityShelf);
router.post('/update-quantity-shelf-V2', updateQuantityShelfProductV2);

router.get('/getProducts', getProductsInInventoryController);
router.get('/getProductV2', getProductV2InInventoryController);

// router.get('/getSuppliers', getSuppliersInInventoryController);
router.get('/get-one/:productId', getOne);
router.get('/get-oneV2/:productId', getOneV2);

router.get("/search", search);
router.get("/searchV2", searchV2);

router.post("/check-inventory",checkInventory)


module.exports = router;
