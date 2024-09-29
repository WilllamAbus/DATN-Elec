const express = require("express");
const router = express.Router();
const {
    addContact,
} = require("../../../controler/contact.controller");
const middlewareController = require("../../../middleware/auth");

router.post('/add', middlewareController.verifyToken, addContact);

module.exports = router;