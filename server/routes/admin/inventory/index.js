const express = require('express');
const router = express.Router();
const {
   listInventory,
   updateQuantityShelf,
   getProductsInInventoryController,
  //  getSuppliersInInventoryController,
   search,
   getOne,
   checkInventory
 } = require('../../../controler/admin/inventoryController');
router.get('/list',listInventory);
router.post('/update-quantity-shelf', updateQuantityShelf);
router.get('/getProducts', getProductsInInventoryController);
// router.get('/getSuppliers', getSuppliersInInventoryController);
router.get('/get-one/:productId', getOne);
router.get("/search", search);
router.post("/check-inventory",checkInventory)


module.exports = router;
