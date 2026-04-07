// controllers/paymentController.js

const momoService  = require('../../../services/orders/orderHq/momo.service');




const momoPayMent = {
    createPayment:async(req, res) =>{
        const { amount, orderId, orderInfo } = req.body;
      
        try {
          const paymentLink = await momoService.createPaymentLink(amount, orderId, orderInfo);
          res.status(200).json({ paymentLink });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
}

module.exports = momoPayMent