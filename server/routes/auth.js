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
router.put('/profile/:id',middlewareController.verifyToken,authController.updatePassword);
router.get('/profile/:id',middlewareController.verifyToken, authController.getProfile);

//very
router.get('/verifyEmail', authController.verifyEmail);
router.post('/resendEmail', authController.resendEmail);
//resetpass
router.post('/forgot-password', authController.forgotPassword);
router.put('/resetPassword', authController.resetPassword);


module.exports = router;
