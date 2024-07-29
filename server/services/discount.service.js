"use strict";

const _Category = require("../model/catgories.model");
const _Discount = require("../model/discount.model");

const discountService = {
  getAllDiscounts: async () => {
    return await _Discount.findWithCategory({});
  },

  getDiscountById: async (id) => {
    return await _Discount.findById(id).populate("cateReady.category");
  },

  createDiscount: async (discountData) => {
    try {
        const { code, discountNum, cateReady, expiryDate, conditionActive, isActive } = discountData;
    
        // Validate input data
        if (!code || !discountNum || !expiryDate || !conditionActive) {
          throw new Error('Missing required fields');
        }
    
        // Ensure cateReady is an array of strings
        if (!Array.isArray(cateReady) || cateReady.some(c => typeof c !== 'string')) {
          throw new Error('cateReady should be an array of category names');
        }
    
        // Fetch categories from the database based on names
    
        const categories = await _Category.find({ name: { $in: cateReady } });
      
        // Check if all provided categories exist in the fetched categories
        if (categories.length !== cateReady.length) {
          throw new Error('One or more categories do not exist');
        }
    
        // Create a discount document
        const newDiscount = new _Discount({
          code,
          discountNum,
          cateReady: cateReady.map(name => {
            const category = categories.find(cat => cat.name === name);
            return {
              category: category._id,
              name: category.name
            };
          }),
          expiryDate,
          conditionActive,
          isActive: isActive !== undefined ? isActive : true,
        });
    
        // Save the discount to the database
        const savedDiscount = await newDiscount.save();
    
        return savedDiscount;
      } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Propagate the error to be handled by the controller or middleware
      }
  },
  updateDiscount: async (id, data) => {
    try {
        if (data.cateReady && Array.isArray(data.cateReady)) {
          const categories = await Promise.all(
            data.cateReady.map(async (cate) => {
              if (typeof cate === 'string') {
                // Find category by name
                const categoryExists = await _Category.findOne({ name: cate });
            
                if (!categoryExists) {
                  throw new Error(`Category with name ${cate} does not exist.`);
                }
                return { category: categoryExists._id, name: categoryExists.name };
              } else {
                throw new Error('Invalid category format.');
              }
            })
          );
    
          // Assign the processed categories to cateReady
          data.cateReady = categories;
        } else {
          throw new Error('cateReady must be an array.');
        }
    
        const updatedDiscount = await _Discount.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        });
        
        if (!updatedDiscount) {
          throw new Error('Discount not found.');
        }
    
        return updatedDiscount;
      } catch (error) {
        console.error('Error in updateDiscount service:', error.message);
        throw new Error(error.message);
      }
  },

  deleteDiscount: async (id) => {
    return await _Discount.findByIdAndDelete(id);
  },
};

module.exports = discountService;
