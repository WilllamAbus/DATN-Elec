const orderService = require("../../../services/orders/orderHq/ordersAndDetails.service");
const deleOrderService = require("../../../services/orders/orderHq/relationSoftDelOrder/deletedOrderIterUser");

const orderAndDetailControler = {
    createOrder : async (req, res) => {
      try {
        const { userId, auctionDetails, payment } = req.body;
        const orderData = {
          userId,
          auctionDetails, // Rename to auctionID
           payment, // Rename to payment
        };
    
    
    
        const order = await orderService.createOrderWithDetails(orderData);
        if (payment === 'MoMo') {
          res.status(200).json({
            success: true,
            status: 200,
            // Include MoMo payment link in response
            data: order
          });
        } else if (payment === 'VnPay') {
          res.status(200).json({
            success: true,
            status: 200,
            // Include VNPay payment link in response
            data: order
          });
        } else if (payment === 'Cash') {
          res.status(200).json({
            success: true,
            status: 201,
            message: 'Thanh toán bằng tiền mặt',
            data: order
          });
        } else {
          res.status(400).json({
            success: false,
            status: 400,
            message: 'Phương thức thanh toán không hợp lệ'
          });
        }
       
      } catch (error) {
        console.error("error::", error);
        
        res.status(500).json({ message: error.message });
      }
      },
      getProductDetailsAuction: async (req, res) => {
        try {
            const { auctionId } = req.body; // Sử dụng req.body để lấy tham số từ request body
            if (!auctionId) {
                return res.status(400).json({ error: 'auctionId là bắt buộc' });
            }
            const productDetails = await orderService.getAuctionProductDetails(auctionId);
            res.status(200).json({
                success: true,
                status: 201,
               
                data: productDetails
              });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateAndGetReceivedOrdersByUser : async (req, res) => {
        try {
            const { userId } = req.query; // Lấy userID từ URL
            const result = await orderService.getAndUpdateOrdersByUser(userId);
    
        
    
            res.status(200).json({
                status: 200,
                success:true,
                data:result
            }); // Trả về danh sách đơn hàng đã cập nhật
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    softDeleteReceivedOrders : async (req, res) => {
        try {
            const { userId } = req.query; // Lấy userId từ URL
            const result = await orderService.softDeleteReceivedOrdersByUser(userId);
    
            res.status(200).json({success:true , status: 200, data: result.updateOrder }); // Trả về thông báo thành công
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getOrderByUser: async(req, res)=>{
      try {
        const userId = req.user.id;
        const result = await orderService.getOrderByUser(userId);
        res.status(200).json({
          success:true,
          status: 200,
          error: - 2,
          data: result
        })
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    getOrderDetails : async (req, res) => {
        try {
            const { orderId } =  req.query; // Sử dụng req.body để lấy tham số từ request body
           console.log('getOrderDetails', orderId);
           
            const orderDetails = await orderService.getOrderDetails(orderId);
            res.status(200).json({ success: true,
                status: 200,
                error: -2,
                data: orderDetails});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getOrderDetailsAdmin : async (req, res) => {
      try {
          const { orderId } =  req.params; // Sử dụng req.body để lấy tham số từ request body
          if (!orderId) {
              return res.status(400).json({ error: 'orderId là bắt buộc' });
          }
          const orderDetails = await orderService.getOrderDetailAdmin(orderId);
          res.status(200).json({ success: true,
              status: 200,
              error: -2,
              data: orderDetails});
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  },

    completeOrder: async (req, res) => {
        try {
            const { orderId } = req.body; // Sử dụng req.body để lấy tham số từ request body
            if (!orderId) {
                return res.status(400).json({ error: 'orderId là bắt buộc' });
            }
            const result = await orderService.completeOrder(orderId);
            res.status(201).json({ 
              success: true,
                status: 201,
            
                data: result});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllOrders: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const search = req.query.search   
   || '';
  
        const { ordersDeleted, totalPages, currentPage } = await orderService.getAllOrders(page, pageSize, search);
  
        return res.status(200).json({
          status: 200,
          message: 'Lấy danh sách đơn hàng  thành công',
          data: {
            ordersDeleted,
            totalPages,
            currentPage,
          },
        });
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: 'Lỗi server: ' + error.message,
        });
      }
  },

  getDeletedOrders : async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search   
 || '';

      const { ordersDeleted, totalPages, currentPage } = await orderService.getDeletedOrders(page, pageSize, search);

      return res.status(200).json({
        status: 200,
        message: 'Lấy danh sách đơn hàng đã xóa thành công',
        data: {
          ordersDeleted,
          totalPages,
          currentPage,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Lỗi server: ' + error.message,
      });
    }
},
      getOrderById : async (req, res) => {
        try {
          const { id } = req.params;
          const order = await orderService.getOrderById(id);
      
          res.status(200).json({ success: true,status: 200, data: order });
        } catch (error) {
          console.error('Error getting order by ID:', error.message);
          res.status(500).json({ message: `Error retrieving order: ${error.message}` });
        }
      },

      restoreOrder : async (req, res) => {
        try {
          const { id } = req.params;
          const order = await orderService.restoreOrder(id);
      
          res.status(200).json({ success: true,status:200, data: order });
        } catch (error) {
          console.error('Error restoring order:', error.message);
          res.status(500).json({ message: `Error restoring order: ${error.message}` });
        }
      },

      softDeleteOrder : async (req, res) => {
        try {
          const { id } = req.params;
          const order = await orderService.softDeleteOrder(id);
      
          res.status(200).json({ success: true,status:200, data: order });
        } catch (error) {
          console.error('Error soft deleting order:', error.message);
          res.status(500).json({ message: `Error soft deleting order: ${error.message}` });
        }
      },

 

      searchOrdersByPhoneNumber : async (req, res) => {
         // Get page and limit from query params
      
        try {
          const { page, search } = req.query;
          const limit = 12; 
          // Call the service function to search orders by phone number
          const result = await orderService.searchOrdersByPhoneNumber(page, search, limit);
      
          // Respond with the paginated result
          return res.status(200).json({
            success: true,
            data: result,
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }
      },


      deleteOrderAndByUser: async (req, res) => {
        try {
          // Extracting parameters from the request body
          const { userId, orderId,serviceRequestId, reason, notes } = req.body;
        
          if (!orderId) {
            return res.status(400).json({ error: "Order ID is required." });
          }
        
          // Proceed with your logic using orderId
      
          
          // Validate required fields
        
          // Handle the auction deletion and service logging
          const result = await deleOrderService.handleAuctionDeletion(userId, orderId,serviceRequestId, reason, notes);

          
          // Respond with success and result
          res.status(200).json({ success: true,  result });
        } catch (error) {
          // Respond with error message
          res.status(500).json({ success: false, message: error.message });
        }
      }

}



module.exports = orderAndDetailControler