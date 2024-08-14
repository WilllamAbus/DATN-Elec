const express = require('express');
const router = express.Router();
const upload = require('../../../middleware/multer.middle');
const {
  addProduct,
  listProduct,
  hardDelete,
  getOne,
  update,
  getAllCategoriesController,
  softDelete,
  deletedList, restore,
  search,
  upView,
  price,
  getProductLimit
} = require('../../../controler/admin/prouctController');

const middlewareController = require('../../../middleware/auth');

router.post('/add', middlewareController.verifyToken, upload.single('image'), addProduct);
router.get("/list", listProduct);
router.delete("/hard-delete/:id", middlewareController.verifyToken, hardDelete);
router.get("/get-one/:id", getOne);
router.put("/update/:id", middlewareController.verifyToken, upload.single('image'), update);
router.get("/listcate", getAllCategoriesController);
router.get('/search/:keyword', search)
router.put('/upView/:id', upView)
router.get('/filter/:price', price)
router.patch("/soft-delete/:id", middlewareController.verifyToken, softDelete);
router.get("/deleted-list", middlewareController.verifyToken, deletedList);
router.patch("/restore/:id", middlewareController.verifyToken, restore);
router.get('/limit', getProductLimit)
module.exports = router;
