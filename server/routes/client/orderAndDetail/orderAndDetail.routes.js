const express = require("express");
const router = express.Router();
const orderController = require("../../../controler/orders/auctions/orderAndDetail.controller");
const middlewareController = require("../../../middleware/auth");

router.post("/create-order",middlewareController.verifyTokenUserAuth, orderController.createOrder);
router.get('/getAll',middlewareController.verifyTokenAdminAuth, orderController.getAllOrders);
router.get('/getByID/:id', orderController.getOrderById);
router.get('/getOrderByUser',middlewareController.verifyToken, orderController.getOrderByUser)
router.patch('/restore/:id',middlewareController.verifyTokenAdminAuth, orderController.restoreOrder);
router.patch('/soft-delete/:id',middlewareController.verifyTokenAdminAuth, orderController.softDeleteOrder);
router.get('/deleted',middlewareController.verifyToken, orderController.getDeletedOrders);
router.get('/search',middlewareController.verifyTokenAdminAuth, orderController.searchOrdersByPhoneNumber);
router.put('/product-details',middlewareController.verifyToken, orderController.getProductDetailsAuction)
router.get('/orderDetailAuc',middlewareController.verifyTokenUserAuth, orderController.getOrderDetails)
router.get('/orderDetailAucDefault',middlewareController.verifyTokenUserAuth, orderController.getOrderDetailsDefault)
router.post('/complete',middlewareController.verifyTokenUserAuth, orderController.completeOrder)
router.put('/received',middlewareController.verifyToken, orderController.updateAndGetReceivedOrdersByUser);
router.patch('/received/soft-delete',middlewareController.verifyToken, orderController.softDeleteReceivedOrders);
router.get('/orderDetailAdmin/:orderId',middlewareController.verifyTokenAdminAuth, orderController.getOrderDetailsAdmin)

router.post('/softOrderByUserEmail',middlewareController.verifyTokenUserAuth, orderController.deleteOrderAndByUser)
router.get('/invoices/:orderId',middlewareController.verifyTokenAdminAuth,orderController.exportInvoiceToPDF);
router.get('/invoicesExecl/:orderId',middlewareController.verifyTokenAdminAuth,orderController.exportInvoiceToExcel);
module.exports = router;