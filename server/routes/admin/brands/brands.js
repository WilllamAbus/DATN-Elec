const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");
const {
    listBrands 
    } = require("../../../controler/admin/brandController");

const middlewareController = require("../../../middleware/auth");

router.get("/list", listBrands);

module.exports = router;
