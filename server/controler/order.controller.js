const orderService = require('../services/order.service');


const orderController = {
    createOrder: async (req, res) => {
        try {
            const orderData = req.body;
    
            if (!orderData) {
                return res.status(400).json({ success: false, message: 'No order data provided' });
            }
    
            const newOrder = await orderService.createOrder(orderData);
    
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: newOrder
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating order: ' + error.message
            });
        }
    },

    getAllOrder : async (req, res) => {
        try {
          const orders = await orderService.getAllOrder();
          res.status(200).json({
            success: true,
            orders
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: error.message
          });
        }
      },
    getOrderbyId : async (req, res) => {
        try {
            const { id } = req.params; // Extracting id from req.params
            const order = await orderService.getOrderById(id);
            res.status(200).json({
                success: true,
                order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
      },

    deleteOrderById: async (req, res) => {
        try {
          const { id } = req.params;
          const deletedOrder = await orderService.deleOrder( id);
          res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
            order: deletedOrder
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: error.message
          });
        }
      }

}


module.exports = orderController