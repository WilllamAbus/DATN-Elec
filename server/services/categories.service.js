'use strict'


const _Category = require('../model/catgories.model');


const upLoadImgBucket = {


    getAllCategories: async () => {
        return await _Category.find({});
    },

    getCategoryById : async (id) => {
        return await _Category.findById(id);
      },

      createCategory: async (categoryData) => {
        // const existingCategory = await _Category.findOne({ name });
        // if (existingCategory) {
        //   return res.status(400).json({ message: 'Category already exists' });
        // }
        const category = new _Category({
          name: categoryData.name, // Ensure 'name' is a string
          pid: categoryData.pid,   // Ensure 'pid' is a string
          path: categoryData.path, // Ensure 'path' is a string
          imgURL: categoryData.imgURL // Ensure 'imgURL' is a string
        });
        await category.save();
        return category;
      },
      updateCategory : async (id, data) => {
        return await _Category.findByIdAndUpdate(id, data, { new: true });
      },

      deleteCategory: async (id) => {
        return await _Category.findByIdAndDelete(id);
      }

}


module.exports = upLoadImgBucket
