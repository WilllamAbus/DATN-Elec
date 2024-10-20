const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");
const middlewareController = require("../../../middleware/auth");
const {
   add,
   getListAuction,
   softDelete,
   getOne
} = require('../../../controler/admin/productAuction');
router.post('/add', upload.array('image'), add);
router.get("/list", getListAuction);
router.get("/get-one/:id", getOne);
router.patch('/softDelete/:id',middlewareController.verifyTokenAdminAuth,softDelete);
module.exports = router;
