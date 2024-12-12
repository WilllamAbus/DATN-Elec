'use strict'
//module
const discountService = require('../services/discount.service');






const discountController = {
  createDiscount: async (req, res) => {
    try {

      const discountData = req.body

      // Call the service to create a discount
      const newDiscount = await discountService.createDiscount(discountData);



      // Send a successful response
      res.status(201).json({ message: "Thêm mới thành công", newDiscount });
    } catch (error) {
      console.error('Error creating discount:', error.message);
      res.status(400).json({ error: error.message }); // Respond with appropriate status and error message
    }
  },

  getAllDiscount: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 5) || 5;

      // Call the service function to get paginated discounts
      const discount = await discountService.getAllDiscount(page, pageSize);

      // Send the response

      res.status(200).json(discount);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getDiscountById: async (req, res) => {
    try {
      const discount = await discountService.getDiscountById(req.params.id);
      if (!discount) {
        return res.status(404).json({ error: 'Discount not found' });
      }
      res.status(200).json(discount);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateDiscount: async (req, res) => {
    try {
      const discount = await discountService.updateDiscount(req.params.id, req.body);
      if (!discount) {
        return res.status(404).json({ error: 'Discount not found' });
      }
      res.status(200).json(discount);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteDiscount: async (req, res) => {
    try {
      const Discount = await discountService.deleteDiscount(req.params.id);
      if (!Discount) {
        return res.status(404).json({ error: 'Discount not found' });
      }
      res.status(200).json({ message: 'Discount deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },



  sofDelDiscount: async (req, res) => {
    try {


      const id = req.params.id;
      // Cập nhật trạng thái của danh mục thành "Đã xóa"
      const softDeletedDiscount = await discountService.softDeleteDiscount(id)

      if (!softDeletedDiscount) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }

      // Trả về phản hồi thành công
      res.status(200).json({ message: 'Đã xóa thành công', data: softDeletedDiscount });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi server
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  deletedListDiscount: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 5) || 5;

      // Call the service function to get paginated deleted discounts
      const deletedList = await discountService.deletedListDiscount(page, pageSize);

      // Send the response with pagination info
      res.status(200).json(deletedList);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  restore: async (req, res) => {
    try {
      // const adminRole = await Role.findOne({ name: 'admin' });


      // if (!adminRole) {
      //     return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
      // }


      // const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

      // if (!isAdmin) {
      //     return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục sản phẩm" });
      // }


      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu id sản phẩm" });
      }

      // Cập nhật trạng thái của sản phẩm thành 'active'
      const restoreProduct = await discountService.restore(id)

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

module.exports = discountController