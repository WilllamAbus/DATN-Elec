const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");
const middlewareController = require("../../../middleware/auth");
const {
   list,
   add,
   addVariant,
   addImageVariant,
   softDelete,
   update,
   selectbrand,
   restore,
   selectSupplier,
   selectDiscount,
   selectProductFormat,
   selectConditionShopping,
   selectCategories,
   getVariantColorsById,
   getVariantsByProductId,
   searchVariants,
   getOneProductVariant,
   getOne,
   getProductLimit,
   deletedList,
   hardDelete,
   deleteVariant,
   editVariant,
   getOneImageVariant,
   editImageVariant,
   getImageByVariantId,
   deleteImageVariant
  } = require('../../../controler/admin/product_v2');
   router.post('/:product_id/addvariant', upload.array('image'), addVariant);
router.get('/list',middlewareController.verifyTokenAdminAuth,list);
router.post('/add', upload.array('image'), add);
router.post('/:product_variant_id/add-image-variant', upload.array('image'), addImageVariant);
router.get("/get-one-image-variant/:image_variant_id", getOneImageVariant);
router.patch('/softDelete/:id',middlewareController.verifyTokenAdminAuth,softDelete);
router.get('/selectbrand',selectbrand);
router.get('/get-color-variant/:product_variant_id',getVariantColorsById);
router.get('/selectsupplier',selectSupplier);
router.get('/selectdiscount',selectDiscount);
router.get('/selectProductFormat',selectProductFormat);
router.get('/selectConditionSP',selectConditionShopping);
router.get('/selectCategories',selectCategories);
router.get("/getone/:id", getOne);
router.get("/get-one-product-variant/:variantId", getOneProductVariant);
router.patch("/restore/:id", middlewareController.verifyTokenAdminAuth, restore);
router.delete("/hardDelete/:id", middlewareController.verifyTokenAdminAuth, hardDelete);
router.delete("/deleteVariant/:variantId", middlewareController.verifyTokenAdminAuth, deleteVariant);
router.delete("/delete-image-variant/:imageId/:variantId", deleteImageVariant);
router.get("/deletedlist", middlewareController.verifyTokenAdminAuth, deletedList);
router.get("/limit", getProductLimit);
router.get("/get-variant-by-product/:id", getVariantsByProductId);
router.get("/get-image-by-variant/:id", getImageByVariantId);
router.get("/:id?", searchVariants);
router.put(
  "/update/:id",
  middlewareController.verifyToken,
  upload.array("image"),
  update
);
router.put(
  "/updateVariant/:variantId",
  middlewareController.verifyTokenAdminAuth,
  upload.array("image"),
  editVariant
);
router.put(
  "/updateImageVariant/:image_variant_id",
  middlewareController.verifyTokenAdminAuth,
  upload.array("image"),
  editImageVariant
);


module.exports = router;
