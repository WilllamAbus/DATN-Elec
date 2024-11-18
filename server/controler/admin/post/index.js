const { addPost } = require('./add/addPost');
const { addCategoryPost } = require('./add/addCategoryPost');
const { listCategoryPost } = require('./list/listCategoryPost');
const { softDeleteCategoryPost } = require('./delete/softDeleteCategoryPost');
const { softDeletePost } = require('./delete/softDeletePost');
const { selectProduct } = require('./select/selectProduct');
const { selectCategoryPost } = require('./select/selectCategoryPost');
const { listPost } = require('./list/listPost');
const { getOnePost } = require('./detail/getOnePost');
const { editPost } = require('./edit/editPost');
module.exports = {
  addPost,
  addCategoryPost,
  listCategoryPost,
  softDeleteCategoryPost,
  selectProduct,
  selectCategoryPost,
  listPost,
  getOnePost,
  editPost,
  softDeletePost
}