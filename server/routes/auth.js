const express = require('express');
const router = express.Router();
const authController = require('../controler/authentication/auth.controller');
const middlewareController = require('../middleware/auth');

router.post('/register', authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", middlewareController.verifyToken, authController.logout);
router.post("/refresh", authController.requestRefreshToken);
router.get('/list', middlewareController.verifyToken, authController.list);
router.delete('/delete/:id', middlewareController.verifyTokenAdminAuth, authController.hardDelete);
module.exports = router;
