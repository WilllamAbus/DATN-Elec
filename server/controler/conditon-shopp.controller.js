'use strict'
const conditionService = require('../services/condition-shopp.service');

const conditionController ={
    createCondition : async (req, res) => {
        try {
            const conditionData = req.body;
            const newCondition = await conditionService.createCondition(conditionData );
            res.status(201).json(newCondition);
          } catch (error) {
            console.error('Error creating Condition:', error.message);
            res.status(400).json({ error: error.message }); // Respond with appropriate status and error message
          }
      },

      getAllCondition : async (req, res) => {
        try {
            const condition = await conditionService.getAllCondition();
         
          res.status(200).json({data: condition});
          
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      getConditionById : async (req, res) => {
        try {
          const condition = await conditionService.getConditionById(req.params.id);
          if (!condition) {
            return res.status(404).json({ error: 'Condition not found' });
          }
          res.status(200).json(condition);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      updateCondition : async (req, res) => {
        try {
          const condition = await conditionService.updateCondition(req.params.id, req.body);
          if (!condition) {
            return res.status(404).json({ error: 'Condition not found' });
          }
          res.status(200).json(condition);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      },

      deleteCondition : async (req, res) => {
        try {
          const condition = await conditionService.deleteCondition(req.params.id);
          if (!condition) {
            return res.status(404).json({ error: 'Condition not found' });
          }
          res.status(200).json({ message: 'Condition deleted successfully' });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },



      sofDelCondition: async (req, res)=>{
        try {
         
    
          const id = req.params.id;
          // Cập nhật trạng thái của danh mục thành "Đã xóa"
          const softDeletedCondition = await conditionService.softDeleteCondition(id)
    
          if (!softDeletedCondition ) {
              return res.status(404).json({ message: "Không tìm thấy danh mục" });
          }
    
          // Trả về phản hồi thành công
          res.status(200).json({ message: 'Đã xóa thành công', data: softDeletedCondition });
      } catch (error) {
          // Xử lý lỗi và trả về phản hồi lỗi server
          res.status(500).json({ message: "Lỗi server", error: error.message });
      }
      },
    
      deletedListCondition: async(req, res)=>{
        try {
            
            
            // Call the service function to get paginated deleted Conditions
            const deletedList = await conditionService.deletedListCondition();
            
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
          const restoreCondition= await conditionService.restore(id)
    
          if (!restoreCondition) {
              return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
          }
    
          // Trả về phản hồi thành công
          res.status(200).json({ message: "Sản phẩm đã được khôi phục thành công", data: restoreCondition });
      } catch (error) {
          // Xử lý lỗi và trả về phản hồi lỗi server
          res.status(500).json({ message: "Lỗi server", error: error.message });
      }
      }
}

module.exports = conditionController