const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");
const middlewareController = require("../../../middleware/auth");
const {
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
} = require('../../../controler/admin/post');

router.post('/add-post-product', upload.array('thumbnail'), addPost);
router.put('/edit-post/:id', upload.array('thumbnail'), editPost);
router.post('/add-categories-post', upload.array('image'), addCategoryPost);
router.get('/list-categories-post', listCategoryPost);
router.patch('/softDelete/:id',middlewareController.verifyTokenAdminAuth,softDeleteCategoryPost);
router.patch('/soft-delete-post/:id',middlewareController.verifyTokenAdminAuth,softDeletePost);
router.get('/select-product', selectProduct);
router.get('/select-categories-post', selectCategoryPost);
router.get('/list-post', listPost);
router.get('/get-one-post/:postId', getOnePost);
module.exports = router;
