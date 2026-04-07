const express = require("express");
const router = express.Router();

const randBinController  = require("../../../controler/orders/auctions/rangBid.controller");
const middlewareController = require("../../../middleware/auth");




router.get('/getRandBid/:productId', randBinController.getRandBid);
router.post('/create',middlewareController.verifyTokenAdminAuth, randBinController.postRandBid);
router.get('/productRandBid',  randBinController.getProductAuctionAdmin);
router.get('/getAllRandBid',  randBinController.getAllPriceRange);
router.put('/editRandBid/:id', middlewareController.verifyTokenAdminAuth, randBinController.editPriceRange);
router.patch('/softDelRandBid/:id', middlewareController.verifyTokenAdminAuth, randBinController.softDeletePriceRangeBid);
router.patch('/restoreRandBid/:id', middlewareController.verifyTokenAdminAuth, randBinController.restorePriceRangeBid);
router.get('/deletedRandBid',middlewareController.verifyTokenAdminAuth,  randBinController.getDeletedPriceRangeBid);
module.exports = router;