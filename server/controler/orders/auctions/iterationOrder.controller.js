const iteractionOrderAucService = require('../../../services/orders/orderHq/oderAucIteration.service')


const iteractionOrderAuController = {
  getOrderByUser: async(req, res)=>{
    try {
      const { userId } = req.query; // Lấy userId từ req.body
      const result = await iteractionOrderAucService.getOrderByUser(userId);
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
    getShippingOrderByUser : async(req,res)=>{
        try {
            const { userId } = req.query; // Lấy userId từ req.body
        
            // Gọi hàm từ Service
            const result = await iteractionOrderAucService.getShippingOrdersByUser(userId);
        
            // Trả về kết quả cho client
            return res.status(200).json({
              success: true,
              status: 200,
              data: result,
            });
        
          } catch (error) {
            // Xử lý lỗi
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }
    },


    getReciveOrderByUser : async(req,res)=>{
        try {
            const { userId } = req.query; // Lấy userId từ req.body
        
            // Gọi hàm từ Service
            const result = await iteractionOrderAucService.getReciveOrdersByUser(userId);
        
            // Trả về kết quả cho client
            return res.status(200).json({
              success: true,
              status: 200,
              data: result,
            });
        
          } catch (error) {
            // Xử lý lỗi
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }

    },
    getCompleteOrderByUser: async(req, res)=>{
        try {
            const { userId } = req.query; // Lấy userId từ req.body
        
            // Gọi hàm từ Service
            const result = await iteractionOrderAucService.getCompleteOrdersByUser(userId);
        
            // Trả về kết quả cho client
            return res.status(200).json({
              success: true,
              status: 200,
              data: result,
            });
        
          } catch (error) {
            // Xử lý lỗi
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }
    },
    softDeleteReceivedOrders : async (req, res) => {
        try {
            const { orderId } = req.query; // Lấy userId từ URL
            const result = await iteractionOrderAucService.softDeleteReceivedOrdersByUser(orderId);
    
            res.status(200).json({
              success:true , 
              status: 200,
              message:"Đã xóa thành công",
               data: result.updateOrder }); // Trả về thông báo thành công
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateorderStatus: async(req, res)=>{
      try {
        const {orderId} = req.query;
    
        const updateOrderStatus = iteractionOrderAucService.updateOrderStatus(orderId)
        res.status(200).json({success:true , status: 200, data: updateOrderStatus})
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  
    }
}

module.exports = iteractionOrderAuController