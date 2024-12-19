// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();

const iteractionOrderAuController = require('../../../controler/orders/auctions/iterationOrder.controller')
const middlewareController = require("../../../middleware/auth");
// Route to create a payment link
router.get('/allOrder',middlewareController.verifyTokenUserAuth, iteractionOrderAuController.getOrderByUser);
router.get('/shippStateOrderAuc',middlewareController.verifyTokenUserAuth, iteractionOrderAuController.getShippingOrderByUser);

router.get('/pendingStateOrderAuc',middlewareController.verifyTokenUserAuth, iteractionOrderAuController.getPendingOrderByUser);
router.get('/confirmStateOrderAuc',middlewareController.verifyTokenUserAuth, iteractionOrderAuController.getConfirmedOrderByUser);

router.get('/reciveStateOrderAuc',middlewareController.verifyTokenUserAuth, iteractionOrderAuController.getReciveOrderByUser);
router.get('/completStateOrderAuc',middlewareController.verifyTokenUserAuth, iteractionOrderAuController.getCompleteOrderByUser);
router.patch('/received/soft-delete/:orderId',middlewareController.verifyTokenAdminAuth, iteractionOrderAuController.softDeleteReceivedOrders);
router.put('/updateStatus/:orderId', middlewareController.verifyTokenAdminAuth, iteractionOrderAuController.updateorderStatus)
router.put('/updateStatusCash/:orderIdCash', middlewareController.verifyTokenAdminAuth, iteractionOrderAuController.updateorderStatusForCash)
router.get('/invoices/:orderId',middlewareController.verifyTokenAdminAuth,iteractionOrderAuController.exportInvoiceToPDF);
router.get('/invoicesExecl/:orderId',middlewareController.verifyTokenAdminAuth,iteractionOrderAuController.exportInvoiceToExcel);
module.exports = router;