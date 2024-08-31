const express = require('express');
const router = express.Router();
const {
   list,
 } = require('../../../controler/admin/inventory');
router.get('/list',list);


module.exports = router;
