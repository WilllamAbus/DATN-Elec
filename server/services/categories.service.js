"use strict";

const _Category = require("../model/catgories.model");

const upLoadImgBucket = {
  checkCategoryExists: async (name) => {
    try {
      const category = await _Category.findOne({ name });
      return !!category; // Return true if category exists, otherwise false
    } catch (error) {
      throw new Error("Error checking category");
    }
  },

  getCategoryById: async (id) => {
    return await _Category.findById(id);
  },

  createCategory: async (categoryData) => {
    // const existingCategory = await _Category.findOne({ name });
    // if (existingCategory) {
    //   return res.status(400).json({ message: 'Category already exists' });
    // }
    const category = new _Category({
      name: categoryData.name, // Ensure 'name' is a string
      pid: categoryData.pid, // Ensure 'pid' is a string
      path: categoryData.path, // Ensure 'path' is a string
      imgURL: categoryData.imgURL, // Ensure 'imgURL' is a string
    });
    await category.save();
    return category;
  },
  updateCategory: async (id, data) => {
    return await _Category.findByIdAndUpdate(id, data, { new: true });
  },

  deleteCategory: async (id) => {
    return await _Category.findByIdAndDelete(id);
  },
  getAllCategories: async () => {
    return await _Category.find({ status: { $ne: "disable" } });
  },
  softDeleteCategory: async (id) => {
    try {
      return await _Category.findByIdAndUpdate(
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
      return await _Category.find({ status: "disable" });
    } catch (error) {
      console.error(error);
    }
  },
  restore: async (id) => {
    try {
      return await _Category.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = upLoadImgBucket;
