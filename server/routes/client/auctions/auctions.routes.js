const express = require("express");
const router = express.Router();

// const auctionController  = require("../../../controler/orders/auctions/auction.controller");
const middlewareController = require("../../../middleware/auth");
const randinBidAuction = require("../../../controler/orders/auctions/randiiBidV2/randBid.controller");

// router.get('/get-auction-details',middlewareController.verifyTokenUserAuth,auctionController.getAuctionDetails);
// router.post('/complete',middlewareController.verifyToken,auctionController.completeAuctionController);
// router.get('/auctionByID/:auctionId', auctionController.getAuctionById); // Get auction by ID
// router.delete('delAuction/:auctionId',middlewareController.verifyTokenAdminAuth, auctionController.deleteAuction); // Permanently delete auction
// router.patch('/soft-delete/:auctionId',middlewareController.verifyTokenAdminAuth, auctionController.softDeleteAuction); // Soft delete auction
// // router.patch('/soft-delete', auctionController.softDeleteAuctionsList); // Soft delete multiple auctions
// router.patch('/restore/:auctionId',middlewareController.verifyTokenAdminAuth, auctionController.restoreAuction); // Restore auction
// router.get('/soft-deleted', auctionController.getSoftDeletedAuctions);
// router.get('/getAll', auctionController.getAllAuctions);
// router.get('/search', auctionController.searchAuctionsByWinnerName);
// router.get('/getAuctDetails',middlewareController.verifyTokenUserAuth, auctionController.getAuctionDetailsV2);



router.post('/addRandBiidAuc',middlewareController.verifyTokenAdminAuth,randinBidAuction.postRandBid);
router.get('/allPriceRandAuc',middlewareController.verifyTokenAdminAuth,randinBidAuction.getAllPriceRange);
router.get('/getIdPriceRandAuct/:id',middlewareController.verifyTokenAdminAuth,randinBidAuction.getByIdPriceRanAuct);
router.get('/allInBound',middlewareController.verifyTokenAdminAuth,randinBidAuction.getProductInBoutAdmin);
router.get('/deleted-PriceRanAuc',middlewareController.verifyTokenAdminAuth,randinBidAuction.getDeletedPriceRangeBid);
router.delete('/deletePriceRanAuc',middlewareController.verifyTokenAdminAuth,randinBidAuction.deletePriceRangeBid);
router.patch('/softDelPriceRanAuc/:id',middlewareController.verifyTokenAdminAuth,randinBidAuction.softDeletePriceRangeBid);
router.patch('/restorePriceRanAuc/:id',middlewareController.verifyTokenAdminAuth,randinBidAuction.restorePriceRangeBid);
router.put('/putPriceRandAuc/:id',middlewareController.verifyTokenAdminAuth,randinBidAuction.editPriceRange);
module.exports = router;