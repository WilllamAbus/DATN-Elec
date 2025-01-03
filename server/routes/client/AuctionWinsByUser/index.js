const express = require('express');
const router = express.Router();
const { getAuctionWinsByUser,confirmAuction,canceledAuction,getUserPendingAuctionWins,canceledAuctionTemporary} = require('../../../controler/client');

const middlewareController = require("../../../middleware/auth");

router.get('/auction-win', middlewareController.verifyToken, getAuctionWinsByUser);
router.get('/check-auction-win', middlewareController.verifyToken, getUserPendingAuctionWins);
router.post('/confirm-auction', middlewareController.verifyToken,confirmAuction);
router.post('/canceled-auction', middlewareController.verifyToken,canceledAuction);
router.post('/canceled-auction-temporary', middlewareController.verifyToken,canceledAuctionTemporary);
module.exports = router;
