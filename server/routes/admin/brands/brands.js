const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");
const {
    listBrands,
    addBrand,
    getAllCategoriesController,
    getAllSuppliersController,
    getOne,
    update,
    hardDelete,
    softDelete,
    deletedList,
    restore,
    search,
    searchDelete
} = require("../../../controler/admin/brandController");

const middlewareController = require("../../../middleware/auth");

router.get("/list", listBrands);
router.post(
    "/add",
    middlewareController.verifyToken,
    upload.single("image"),
    addBrand
);

router.get("/listcate",
    getAllCategoriesController);
router.get("/listsupplier",
    getAllSuppliersController);
router.get("/get-one/:id", getOne);
router.put(
    "/update/:id",
    middlewareController.verifyToken,
    upload.single("image"),
    update
);

router.delete("/hard-delete/:id",
    middlewareController.verifyToken,
    hardDelete
);
router.patch("/soft-delete/:id",
    middlewareController.verifyToken,
    softDelete);

router.get("/deleted-list",
    middlewareController.verifyToken,
    deletedList);

router.patch("/restore/:id",
    middlewareController.verifyToken,
    restore);

router.get("/search", search);
router.get("/searchDelete", searchDelete);


module.exports = router;
