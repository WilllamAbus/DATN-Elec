'use strict'


const _Category = require('../model/catgories.model');


const upLoadImgBucket = {


    getAllCategories: async () => {
        return await _Category.find({});
    },

    getCategoryById : async (id) => {
        return await _Category.findById(id);
      },

      createCategory: async (name, pid, path, imgURL) => {
        const category = new _Category({ name, pid, path, imgURL });
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
