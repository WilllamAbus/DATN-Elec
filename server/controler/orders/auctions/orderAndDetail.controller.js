const orderService = require("../../../services/orders/orderHq/ordersAndDetails.service");


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
            if (!orderId) {
                return res.status(400).json({ error: 'orderId là bắt buộc' });
            }
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
      const { search } = req.query; // Lấy từ query string
      const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
      const limit = parseInt(req.query.limit) || 5; // Giới hạn mặc định là 5

      const result = await orderService.getAllOrders(search, page, limit);

      if (result.success) {
          return res.status(200).json({
            status: 200 ,
            data: {
              success: true,
              data: result.data, // Ensure you're sending back the orders and pagination details
            },
          });
      } else {
          return res.status(500).json({ success: false, message: result.message });
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

      getDeletedOrders : async (req, res) => {
        try {
            const { page, limit } = req.query; // Lấy số trang và giới hạn từ query params
            const paginationResult = await orderService.getDeletedOrders(page, limit );
    
            res.status(200).json({
              success: true,
              data: paginationResult.orders,
              pagination: {
                totalOrders: paginationResult.totalOrders,
                totalPages: paginationResult.totalPages,
                currentPage: paginationResult.currentPage,
              },

            }); // Trả về kết quả phân trang
        } catch (error) {
            res.status(500).json({ error: error.message });
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
      }

}



module.exports = orderAndDetailControler