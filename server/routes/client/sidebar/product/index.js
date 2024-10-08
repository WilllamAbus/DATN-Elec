
const express = require('express');
const router = express.Router();
const {getAllColorVariant} = require('../../../../controler/client');
router.get('/get-all-color-variant',getAllColorVariant);
module.exports = router;
