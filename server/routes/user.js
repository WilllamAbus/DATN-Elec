const express = require('express');
const router = express.Router();
const userController = require('../controler/user.controller');
const middlewareController = require('../middleware/auth');


router.get("/get-current", middlewareController.verifyToken, userController.getCurrent);

module.exports = router;
