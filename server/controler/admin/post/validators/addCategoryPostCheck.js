// ../validators/checkCategoryPost.js
const CategoryPost = require('../../../../model/post/categoryPost');

/**
 * Kiểm tra xem danh mục với tên đã cho có tồn tại hay không.
 * @param {string} name - Tên danh mục cần kiểm tra.
 * @returns {Promise<boolean>} - Trả về `true` nếu danh mục đã tồn tại, `false` nếu chưa.
 */
const checkCategoryNameExists = async (name) => {
  try {
    return await CategoryPost.findOne({ name: name });
  } catch (error) {
    console.error('Lỗi khi kiểm tra tên danh mục:', error);
    throw error;
  }
};
const isValidCategoryName = (name) => {
  return typeof name === 'string' && name.trim() !== '';
};
module.exports = {
  checkCategoryNameExists,
  isValidCategoryName
};
