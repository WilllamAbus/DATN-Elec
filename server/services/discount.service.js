"use strict";

const _Discount = require("../model/discount.model");
const validator = require("validator")



const discountService = {


  getDiscountById: async (id) => {
    return await _Discount.findById(id)
  },

  createDiscount : async (discountData) => {
    try {
      const ERROR_CODE_PATTERN = /^IDS\d{4}$/;
   

      const { code, discountPercent, } = discountData;
    
      // Kiểm tra các trường bắt buộc
      if (!ERROR_CODE_PATTERN.test(code)) {
        throw new Error("Invalid error code format");
      }
  
      // Kiểm tra các trường bắt buộc
      if (!code || discountPercent === undefined) {
        throw new Error("IDS0524: Missing required fields");
      }
  
      // Kiểm tra giá trị discountPercent
      if (!validator.isInt(discountPercent.toString(), { min: 6, max: 44 })) {
        throw new Error("IDS0524: Discount percentage must be greater than 5% and less than 45%");
      }
  
  
      // Tạo mới discount
      const newDiscount = new _Discount({
        code,
        discountPercent,
        // isActive có giá trị mặc định là true trong model nên không cần truyền
      });
      
    
  
      // Lưu discount vào cơ sở dữ liệu
      const savedDiscount = await newDiscount.save();
      return savedDiscount;
    } catch (error) {
      console.error("Error creating discount:", error);
      throw error; // Propagate the error to be handled by the controller or middleware
    }
  },
  updateDiscount: async (id, data) => {
    try {
      const {discountPercent} = data
     
      const updatedDiscount = await _Discount.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (discountPercent > 65) {
        return { status: 400, message: "Giảm giá không được vượt quá 65%." };
      }
      if (!updatedDiscount) {
        throw new Error("Discount not found.");
      }

      return updatedDiscount;
    } catch (error) {
      console.error("Error in updateDiscount service:", error.message);
      throw new Error(error.message);
    }
  },

  deleteDiscount: async (id) => {
    
    try {
     
        const deleteDiscount= await _Discount.findByIdAndDelete(id);
        return deleteDiscount
    } catch (error) {
        console.error("Error in updateDiscount service:", error.message);
        throw new Error(error.message);
    }
    
  },
  getAllDiscount:  async (page = 1, pageSize = 5) => {
    try {
      // Validate page and pageSize parameters
      const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
      const size = parseInt(pageSize, 5) > 0 ? parseInt(pageSize, 5) : 5;
  
      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * size;
  
      // Fetch the paginated list of active discounts
      const [discounts, totalCount] = await Promise.all([
        _Discount.find({ status: { $ne: "disable" } })
                  .skip(skip)
                  .limit(size),
        _Discount.countDocuments({ status: { $ne: "disable" } })
      ]);
      
      // Return the list of discounts along with pagination info
      return {
        discounts: Array.isArray(discounts) ? discounts : [],
        pagination: [
          {   page: pageNumber,
            pageSize: size,
            total: totalCount,
            totalPages: Math.ceil(totalCount / size),
          }
        ]
       
        }
      
    } catch (error) {
      console.error("Error fetching discounts:", error);
      throw new Error("Failed to fetch discounts");
    }
  },
  softDeleteDiscount: async (id) => {
    try {
        // const adminRole = await Role.findOne({ name: 'admin' });


        // if (!adminRole) {
        //     return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
        // }


        // const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());

        // if (!isAdmin) {
        //     return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể cập nhật sản phẩm" });
        // }
        const nowUtc = new Date();
    
        // Chuyển đổi thời gian UTC về múi giờ Việt Nam
        // Múi giờ Việt Nam là UTC + 7 giờ
        const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
        const now = new Date(nowUtc.getTime() + offset);
    
        const softDeleteDiscount = await _Discount.findByIdAndUpdate(
            id,
            { status: "disable",   disabledAt: now },
            
            { new: true }
          );
      return softDeleteDiscount
    } catch (error) {
      console.error(error);
    }
  },
  deletedListDiscount:async (page = 1, pageSize = 10) => {
    try {
      // Validate page and pageSize parameters
      const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
      const size = parseInt(pageSize, 5) > 0 ? parseInt(pageSize, 5) : 5;
  
      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * size;
  
      // Fetch the paginated list of deleted discounts
      const [deletedDiscounts, totalCount] = await Promise.all([
        _Discount.find({ status: "disable" })  // Assuming "disable" status indicates deletion
                  .skip(skip)
                  .limit(size),
        _Discount.countDocuments({ status: "disable" })
      ]);
      
      // Return the list of deleted discounts along with pagination info
      return {
        deletedDiscounts: Array.isArray(deletedDiscounts) ? deletedDiscounts : [],
        pagination: [{
          page: pageNumber,
          pageSize: size,
          total: totalCount,
          totalPages: Math.ceil(totalCount / size),
        }]
      };
    } catch (error) {
      console.error("Error fetching deleted discounts:", error);
      throw new Error("Failed to fetch deleted discounts");
    }
},
  restore: async (id) => {
    try {
      
        const restore =  await _Discount.findByIdAndUpdate(
            id,
            { status: "active" },
            { new: true }
          );
     return restore
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = discountService;