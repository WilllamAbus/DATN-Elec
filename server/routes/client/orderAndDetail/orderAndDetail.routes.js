const express = require("express");
const router = express.Router();
const orderController = require("../../../controler/orders/auctions/orderAndDetail.controller");
const middlewareController = require("../../../middleware/auth");

router.post("/create-order",middlewareController.verifyToken, orderController.createOrder);
router.get('/getAll', orderController.getAllOrders);
router.get('/getByID/:id', orderController.getOrderById);
router.post('/restore/:id',middlewareController.verifyTokenAdminAuth, orderController.restoreOrder);
router.delete('/soft-delete/:id',middlewareController.verifyTokenAdminAuth, orderController.softDeleteOrder);
router.get('/deleted', orderController.getDeletedOrders);
router.get('/search', orderController.searchOrdersByPhoneNumber);
router.put('/product-details',middlewareController.verifyToken, orderController.getProductDetailsAuction)
router.put('/orderDetailAuc',middlewareController.verifyToken, orderController.getOrderDetails)
router.post('/complete',middlewareController.verifyToken, orderController.completeOrder)
router.put('/received',middlewareController.verifyToken, orderController.updateAndGetReceivedOrdersByUser);
router.patch('/received/soft-delete',middlewareController.verifyToken, orderController.softDeleteReceivedOrders);
module.exports = router;