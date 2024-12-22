const express = require("express");
const router = express.Router();

const biddingController  = require("../../../controler/client/autions/biddingList.controller");
const middlewareController = require("../../../middleware/auth");

router.post("/placeBid", middlewareController.verifyToken, biddingController.placeBid);




module.exports = router;