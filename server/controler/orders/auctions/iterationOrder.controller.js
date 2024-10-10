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
         
      
            const { orderId } = req.params; // Lấy userId từ URL
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
        const { orderId } = req.params; // Get orderId from URL parameters
        const { stateOrder } = req.body; // Get newStatus from the request body
    
        const updateOrderStatus = iteractionOrderAucService.updateOrderStatus(orderId, stateOrder)
        console.log('update', updateOrderStatus);
        
        res.status(200).json({success:true ,
           status: 200,
            data: (await updateOrderStatus).order,
             msg: (await updateOrderStatus).message})
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  
    }
}

module.exports = iteractionOrderAuController