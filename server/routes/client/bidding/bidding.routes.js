const express = require("express");
const router = express.Router();

const biddingController  = require("../../../controler/orders/auctions/bidding.controller");
    
const middlewareController = require("../../../middleware/auth");



router.post('/createBiding/:productId',middlewareController.verifyToken, biddingController.createBid);

router.get('/bidAlls', biddingController.getAllBids);


router.get('/getBidID/:bidId', biddingController.getBidById);

router.patch('/softDeteBid/:bidId', biddingController.softDeleteBid);


router.post('/deleteBidd', biddingController.deleteBids);
router.patch('/restoreBidd/:bidId', biddingController.restoreBid);
router.get('/soft-deleted-bids', biddingController.getSoftDeletedBids);
module.exports = router;