const express = require("express");
const router = express.Router();
const authController = require("../../../controler/authentication/auth.controller");
const middlewareController = require("../../../middleware/auth")

router.get(
    "/list",
    middlewareController.verifyTokenAdminAuth,
    authController.list
  );