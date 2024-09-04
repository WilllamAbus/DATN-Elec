const express = require('express');
const router = express.Router();
const {listcatenav} = require('../../../controler/client');
router.get('/listcatenav',listcatenav);
module.exports = router;