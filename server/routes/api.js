const express = require("express");

const { homepage, message } = require("../controler/home")
const {
    verifyOtp,
    regisUser
} = require('../controler/user.controller')
const { checkPermission } = require('../middleware/role.base');
const { createRole } = require('../controler/role.controller')
const router = express.Router();
// Test
router.get('/', homepage)
router.get('/message', message)
// Users - regisOTP
router.post('/users', regisUser)
router.post('/users/verifyOtp', verifyOtp)

// Add Roles
router.post('/addRole', checkPermission, createRole)


module.exports = router;