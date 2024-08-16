'use strict'
//module
const voucherService = require('../services/voucher.service');




const voucherController ={
    createVoucher : async (req, res) => {
        try {
            const voucherData = req.body;
        
            // Call the service to create a discount
            const newVoucher = await voucherService.createVoucher(voucherData );
        
            // Send a successful response
            res.status(201).json(newVoucher);
          } catch (error) {
            console.error('Error creating discount:', error.message);
            res.status(400).json({ error: error.message }); // Respond with appropriate status and error message
          }
      },

      getAllVoucher : async (req, res) => {
        try {
          const voucher= await voucherService.getAllVoucher();
          res.status(200).json(voucher);
          
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      getVoucherById : async (req, res) => {
        try {
          const voucher = await voucherService.getVoucherById(req.params.id);
          if (!voucher) {
            return res.status(404).json({ error: 'Voucher not found' });
          }
          res.status(200).json(voucher);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      updateVoucher : async (req, res) => {
        try {
          const discount = await voucherService.updateVoucher(req.params.id, req.body);
          if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
          }
          res.status(200).json(discount);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },

      deleteVoucher : async (req, res) => {
        try {
          const voucher = await voucherService.deleteVoucher(req.params.id);
          if (!voucher) {
            return res.status(404).json({ error: 'Voucher not found' });
          }
          res.status(200).json({ message: 'Voucher deleted successfully' });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },



      sofDelVoucher: async (req, res)=>{
        try {
         
    
          const id = req.params.id;
          // Cập nhật trạng thái của danh mục thành "Đã xóa"
          const softDeletedVoucher = await voucherService.softDeleteVoucher(id)
    
          if (!softDeletedVoucher ) {
              return res.status(404).json({ message: "Không tìm thấy danh mục" });
          }
    
          // Trả về phản hồi thành công
          res.status(200).json({ message: 'Đã xóa thành công', data: softDeletedVoucher });
      } catch (error) {
          // Xử lý lỗi và trả về phản hồi lỗi server
          res.status(500).json({ message: "Lỗi server", error: error.message });
      }
      },
    
      deletedListVoucher: async(req, res)=>{
        try {
          // const adminRole = await Role.findOne({ name: 'admin' });
    
          // if (!adminRole) {
          //     return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
          // }
    
    
          // const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    
          // if (!isAdmin) {
          //     return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xem danh sách danh mục đã bị xóa mềm" });
          // }
    
    
          const deleteListCategory = await voucherService.deletedList()
    
          res.status(200).json({ data: deleteListCategory });
      } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
      }
      }, 
      restore: async(req, res)=>{
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
          const restoreProduct = await voucherService.restore(id)
    
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

module.exports = voucherController