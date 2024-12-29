const express = require('express');
const router = express.Router();
const { getAuctionWinsByUser,confirmAuction,canceledAuction} = require('../../../controler/client');

const middlewareController = require("../../../middleware/auth");

router.get('/auction-win', middlewareController.verifyToken, getAuctionWinsByUser);
router.post('/confirm-auction', middlewareController.verifyToken,confirmAuction);
router.post('/canceled-auction', middlewareController.verifyToken,canceledAuction);
module.exports = router;
