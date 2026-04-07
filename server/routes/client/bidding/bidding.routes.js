const express = require("express");
const router = express.Router();

const biddingController  = require("../../../controler/orders/auctions/bidding.controller");
    
const middlewareController = require("../../../middleware/auth");



router.post('/createBiding',middlewareController.verifyTokenUserAuth, biddingController.createBid);

router.get('/bidAlls',middlewareController.verifyTokenUserAuth, biddingController.getAllBids);
router.get('/bidAllActive',middlewareController.verifyTokenUserAuth, biddingController.getAllBidsActive);

router.get('/getBidID/:bidId', biddingController.getBidById);

router.patch('/softDeteBid/:bidId',middlewareController.verifyTokenAdminAuth, biddingController.softDeleteBid);


router.post('/deleteBidd',middlewareController.verifyTokenAdminAuth, biddingController.deleteBids);
router.patch('/restoreBidd/:bidId',middlewareController.verifyTokenAdminAuth, biddingController.restoreBid);
router.get('/soft-deleted-bids', biddingController.getSoftDeletedBids);
router.get('/bids',middlewareController.verifyTokenUserAuth, biddingController.getBidsByUser);
router.put('/update-bid',middlewareController.verifyTokenUserAuth, biddingController.updateBidAmountController);
module.exports = router;