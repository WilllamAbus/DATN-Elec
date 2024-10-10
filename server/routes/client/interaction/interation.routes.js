const express = require('express');
const router = express.Router();
const interactionController = require('../../../controler/orders/interaction/interation.controller'); // Import interaction controller
const middlewareController = require("../../../middleware/auth");
// Route để lấy sản phẩm đã mua của người dùng
router.get('/purchased-products/:userId',middlewareController.verifyToken, interactionController.getPurchasedProducts);
router.get('/interactions', interactionController.getAll);
router.get('/interactions/:id', interactionController.getById);
router.patch('/interactions/:id/soft-delete',middlewareController.verifyTokenAdminAuth, interactionController.softDel);
router.patch('/interactions/:id/restore',middlewareController.verifyTokenAdminAuth, interactionController.restore);
router.get('/interactions/deleted', interactionController.getDeletedList);
router.post('/interactions-view',interactionController.postInteractionView);
router.post('/interactions',interactionController.postInteraction);
router.post('/auctions',interactionController.postInteractionAuction);
module.exports = router;