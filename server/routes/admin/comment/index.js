const express = require(`express`);
const router = express.Router();
const repComment = require(`../../../controler/repComment.controller`);
const comment = require(`../../../controler/comment.controller`)
router.get(`/getCommentAdmin`, comment.getCommentAdmin);  
router.get(`/getCommentDelete`, comment.getCommentDelete);  
router.get(`/listDetailComment/:slug`,comment.listDetailComment);
router.delete(`/repComment/:idRepComment`,repComment.deleteRepComment);
router.post(`/repComment/:idComment`, repComment.createRepComment);
router.get(`/repComment/:id`, repComment.getRepComment);
router.delete(`/:idProduct/:idComment`,comment.deleteComment);
router.patch(`/softDelete/:id`,comment.softDeleteComment);
router.patch(`/restore/:id`,comment.restoreComment);

module.exports = router;
