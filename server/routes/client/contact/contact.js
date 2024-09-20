const express = require("express");
const router = express.Router();
const {
    addContact,
} = require("../../../controler/contact.controller");
const middlewareController = require("../../../middleware/auth");

router.post('/add', addContact, middlewareController.verifyToken,);

module.exports = router; 