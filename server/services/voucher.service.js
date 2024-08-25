"use strict";

const _Category = require("../model/catgories.model");
const _Voucher = require("../model/voucher.model");

const voucherService = {


  getVoucherById: async (id) => {
    return await _Voucher.findById(id).populate("cateReady.category");
  },

  createVoucher: async (voucherData) => {
    try {
      const {
        code,
        voucherNum,
        cateReady,
        expiryDate,
        conditionActive,
        isActive,
      } = voucherData;

      // Validate input data
      if (!code || !voucherNum || !expiryDate || !conditionActive) {
        throw new Error("Missing required fields");
      }

      // Ensure cateReady is an array of strings
      if (
        !Array.isArray(cateReady) ||
        cateReady.some((c) => typeof c !== "string")
      ) {
        throw new Error("cateReady should be an array of category names");
      }

      // Fetch categories from the database based on names

      const categories = await _Category.find({ name: { $in: cateReady } });

      // Check if all provided categories exist in the fetched categories
      if (categories.length !== cateReady.length) {
        throw new Error("One or more categories do not exist");
      }
      

      const today = new Date();
      const minValidDate = new Date(today);
      minValidDate.setDate(today.getDate() + 15); // 15 days from today
    
      if (new Date(voucherData.expiryDate) < minValidDate) {
        throw new Error("Hạn sử dụng phải ít nhất là 15 ngày kể từ ngày hôm nay.");
      }
      // Create a discount document
      const newVoucher = new _Voucher({
        code,
        voucherNum,
        cateReady: cateReady.map((name) => {
          const category = categories.find((cat) => cat.name === name);
          return {
            category: category._id,
            name: category.name,
          };
        }),
        expiryDate,
        conditionActive,
        isActive: isActive !== undefined ? isActive : true,
      });

      // Save the discount to the database
      const savedVoucher = await newVoucher.save();

      return savedVoucher;
    } catch (error) {
      console.error("Error creating discount:", error);
      throw error; // Propagate the error to be handled by the controller or middleware
    }
  },
  updateVoucher: async (id, data) => {
    try {
      if (data.cateReady && Array.isArray(data.cateReady)) {
        const categories = await Promise.all(
          data.cateReady.map(async (cate) => {
            if (typeof cate === "string") {
              // Find category by name
              const categoryExists = await _Category.findOne({ name: cate });

              if (!categoryExists) {
                throw new Error(`Category with name ${cate} does not exist.`);
              }
              return {
                category: categoryExists._id,
                name: categoryExists.name,
              };
            } else {
              throw new Error("Invalid category format.");
            }
          })
        );

        // Assign the processed categories to cateReady
        data.cateReady = categories;
      } else {
        throw new Error("cateReady must be an array.");
      }

      const updatedVoucher = await _Voucher.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedVoucher) {
        throw new Error("Discount not found.");
      }

      return updatedVoucher;
    } catch (error) {
      console.error("Error in updateDiscount service:", error.message);
      throw new Error(error.message);
    }
  },

  deleteVoucher: async (id) => {
    return await _Voucher.findByIdAndDelete(id);
  },
  getAllVoucher: async () => {
    return await _Voucher.find({ status: { $ne: "disable" } })
    .populate('cateReady.category', 'name');
  },
  softDeleteVoucher: async (id) => {
    try {
      return await _Voucher.findByIdAndUpdate(
        id,
        { status: "disable" },
        { new: true }
      );
    } catch (error) {
      console.error(error);
    }
  },
  deletedList: async (req, res) => {
    try {
      return await _Voucher.find({ status: "disable" }) || [];
    } catch (error) {
      console.error(error);
    }
  },
  restore: async (id) => {
    try {
      return await _Voucher.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = voucherService;
