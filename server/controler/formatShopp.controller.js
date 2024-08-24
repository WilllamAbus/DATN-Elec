'use strict'
//module
const formatService = require('../services/formatShopp.service');




const formatController ={
    createFormat : async (req, res) => {
        try {
            const formatData = req.body;
        
            // Call the service to create a Format
            const newFormat = await formatService.createFormat(formatData );
        
            // Send a successful response
            res.status(201).json(newFormat);
          } catch (error) {
            console.error('Error creating Format:', error.message);
            res.status(400).json({ error: error.message }); // Respond with appropriate status and error message
          }
      },

      getAllFormat : async (req, res) => {
        try {
        
        
            // Call the service function to get paginated Formats
            const format = await formatService.getAllFormat();
        
            // Send the response
         
          res.status(200).json({data: format});
          
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      getFormatById : async (req, res) => {
        try {
          const Format = await formatService.getFormatById(req.params.id);
          if (!Format) {
            return res.status(404).json({ error: 'Format not found' });
          }
          res.status(200).json(Format);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      updateFormat : async (req, res) => {
        try {
          const Format = await formatService.updateFormat(req.params.id, req.body);
          if (!Format) {
            return res.status(404).json({ error: 'Format not found' });
          }
          res.status(200).json(Format);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },

      deleteFormat : async (req, res) => {
        try {
          const Format = await formatService.deleteFormat(req.params.id);
          if (!Format) {
            return res.status(404).json({ error: 'Format not found' });
          }
          res.status(200).json({ message: 'Format deleted successfully' });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },



      sofDelFormat: async (req, res)=>{
        try {
         
    
          const id = req.params.id;
          // Cập nhật trạng thái của danh mục thành "Đã xóa"
          const softDeletedFormat = await formatService.softDeleteFormat(id)
    
          if (!softDeletedFormat ) {
              return res.status(404).json({ message: "Không tìm thấy danh mục" });
          }
    
          // Trả về phản hồi thành công
          res.status(200).json({ message: 'Đã xóa thành công', data: softDeletedFormat });
      } catch (error) {
          // Xử lý lỗi và trả về phản hồi lỗi server
          res.status(500).json({ message: "Lỗi server", error: error.message });
      }
      },
    
      deletedListFormat: async(req, res)=>{
        try {
          
            
            // Call the service function to get paginated deleted Formats
            const deletedList = await formatService.deletedListFormat();
            
            // Send the response with pagination info
            res.status(200).json({data: deletedList});
          } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
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
          const restoreProduct = await formatService.restore(id)
    
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

module.exports = formatController