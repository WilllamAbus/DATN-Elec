const express = require("express");
const router = express.Router();
const authController = require("../controler/authentication/auth.controller");
const middlewareController = require("../middleware/auth");

const upload = require("../middleware/multer.middle");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", middlewareController.verifyToken, authController.logout);
router.post("/refresh", authController.requestRefreshToken);
router.get("/list", middlewareController.verifyToken, authController.list);
router.delete(
  "/delete/:id",
  middlewareController.verifyTokenAdminAuth,
  authController.hardDelete
);

router.get(
  "/profile",
  middlewareController.verifyToken,
  authController.getProfile
);
router.put(
  "/profile",
  upload.single("avatar"),
  middlewareController.verifyToken,
  authController.updateProfile
);
router.put(
  "/password",
  middlewareController.verifyToken,
  authController.updatePassword
);
//very
router.get("/verifyEmail", authController.verifyEmail);
router.post("/resendEmail", authController.resendEmail);
//resetpass
router.post("/forgot-password", authController.forgotPassword);
router.put("/resetPassword", authController.resetPassword);
//address
router.post(
  "/add",
  middlewareController.verifyToken,
  authController.addAddress
);
router.put(
  "/set-default",
  middlewareController.verifyToken,
  authController.setDefaultAddress
);
router.get(
  "/listAddress",
  middlewareController.verifyToken,
  authController.getAddressList
);
router.put(
  "/update",
  middlewareController.verifyToken,
  authController.updateAddress
);

router.get(
  "/listAddress/:id",
  middlewareController.verifyToken,
  authController.fetchAddressById
);
router.delete(
  "/deleteAddress",
  middlewareController.verifyToken,
  authController.removeAddress
);

module.exports = router;
