const express = require("express");
const router = express.Router();

const auctionController  = require("../../../controler/orders/auctions/auction.controller");
const middlewareController = require("../../../middleware/auth");


router.get('/get-auction-details',middlewareController.verifyToken,auctionController.getAuctionDetails);
router.post('/complete',middlewareController.verifyToken,auctionController.completeAuctionController);
router.get('/auctionByID/:auctionId', auctionController.getAuctionById); // Get auction by ID
router.delete('delAuction/:auctionId',middlewareController.verifyTokenAdminAuth, auctionController.deleteAuction); // Permanently delete auction
router.patch('/soft-delete/:auctionId',middlewareController.verifyTokenAdminAuth, auctionController.softDeleteAuction); // Soft delete auction
// router.patch('/soft-delete', auctionController.softDeleteAuctionsList); // Soft delete multiple auctions
router.patch('/restore/:auctionId',middlewareController.verifyTokenAdminAuth, auctionController.restoreAuction); // Restore auction
router.get('/soft-deleted', auctionController.getSoftDeletedAuctions);
router.get('/getAll', auctionController.getAllAuctions);
router.get('/search', auctionController.searchAuctionsByWinnerName);
module.exports = router;