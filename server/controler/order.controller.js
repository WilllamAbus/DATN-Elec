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

  getAllOrder: async (req, res) => {
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
  getOrderbyId: async (req, res) => {
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
      const deletedOrder = await orderService.deleOrder(id);
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
  },

  sofDelOrder: async (req, res) => {
    try {


      const { id } = req.params;


      // Cập nhật trạng thái của danh mục thành "Đã xóa"
      const softDeletedOrder = await orderService.softDeleteOrder(id)


      if (!softDeletedOrder) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }

      // Trả về phản hồi thành công
      res.status(200).json({ message: 'Đã xóa thành công', softDel: softDeletedOrder });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi server
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  deletedListOrder: async (req, res) => {
    try {



      const deleteListCategory = await orderService.deletedList()

      res.status(200).json({ data: deleteListCategory });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  restore: async (req, res) => {
    try {


      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu id sản phẩm" });
      }

      // Cập nhật trạng thái của sản phẩm thành 'active'
      const restoreProduct = await orderService.restore(id)

      if (!restoreProduct) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      // Trả về phản hồi thành công
      res.status(200).json({ message: "Sản phẩm đã được khôi phục thành công", data: restoreProduct });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi server
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

}


module.exports = orderController