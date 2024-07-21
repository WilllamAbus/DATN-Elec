const useController = require('../controllers/user.controller');
const router = require('express').Router();
const middlewareController = require("../middleware/user");



// Register
router.post("/register", useController.registerUser);
//very
router.get('/verifyEmail', useController.verifyEmail);
router.post('/resendEmail', useController.resendEmail);
//Login
router.post("/login", useController.loginUser);
//resetpass
router.post('/forgot-password', useController.forgotPassword);
router.put('/resetPassword', useController.resetPassword);
//Lấy tất cả User
router.get("/getAll", middlewareController.verifyToken, useController.getAllUser);
// lấy User ID
router.get('/profile/:id', useController.getProfile);
// Cập nhật mật khẩu
router.put('/profile/:id', useController.updatePassword);
//Xóa
router.delete("/:id", middlewareController.verifyTokenAdminAuth, useController.deleteUser);
module.exports = router;
