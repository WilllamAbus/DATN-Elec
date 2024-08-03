const express = require('express');
const router = express.Router();
const upload = require('../../../middleware/multer.middle');
const { addProduct, listProduct, hardDelete, getOne, update, getAllCategoriesController,search, upView, price } = require('../../../controler/admin/prouctController');
const { addProduct, listProduct, hardDelete, getOne, update, getAllCategoriesController, softDelete, deletedList, restore } = require('../../../controler/admin/prouctController');

const middlewareController = require('../../../middleware/auth');

router.post('/add', middlewareController.verifyToken, upload.single('image'), addProduct);
router.get("/list", listProduct);
router.delete("/hard-delete/:id", hardDelete);
router.get("/get-one/:id", getOne);
router.put("/update/:id", middlewareController.verifyToken, upload.single('image'), update);
router.get("/listcate", getAllCategoriesController);

//search
router.get('/search/:keyword',search)
//up view
router.put('/upView/:id',upView)
//comment
router.post('/comment/')
//filer
router.get('/filter/:price', price)
router.patch("/soft-delete/:id", middlewareController.verifyToken, softDelete);
router.get("/deleted-list", middlewareController.verifyToken, deletedList);
router.patch("/restore/:id", middlewareController.verifyToken, restore);
module.exports = router;
