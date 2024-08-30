const express = require("express");
const router = express.Router();

const auctionController  = require("../../../controler/orders/auctions/auction.controller");
    



router.post('/complete/:productId/:timeTrackID',auctionController.completeAuctionController);
router.get('/auctionByID/:auctionId', auctionController.getAuctionById); // Get auction by ID
router.delete('delAuction/:auctionId', auctionController.deleteAuction); // Permanently delete auction
router.patch('/soft-delete/:auctionId', auctionController.softDeleteAuction); // Soft delete auction
// router.patch('/soft-delete', auctionController.softDeleteAuctionsList); // Soft delete multiple auctions
router.patch('/restore/:auctionId', auctionController.restoreAuction); // Restore auction
router.get('/soft-deleted', auctionController.getSoftDeletedAuctions);
router.get('/getAll', auctionController.getAllAuctions);
router.get('/search', auctionController.searchAuctionsByWinnerName);
module.exports = router;