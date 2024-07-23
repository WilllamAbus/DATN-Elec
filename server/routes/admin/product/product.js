const express = require('express');
const router = express.Router();
const { add } = require("../../../controler/admin/prouctController"); 
const middlewareController = require("../../../middleware/auth");
router.post("/add",middlewareController.verifyToken, add);

module.exports = router;
