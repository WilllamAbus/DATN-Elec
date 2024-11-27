const express = require('express');
const router = express.Router();
const comment = require('../../../controler/comment.controller');
const repComment = require('../../../controler/repComment.controller');
const middlewareController = require("../../../middleware/auth");
router.post('/addComment/:slug',middlewareController.verifyToken,comment.addCommentProduct);
router.put('/editCommnet/:slug',comment.updateCommentProduct);
router.get('/:slug', comment.getCommentProduct);
router.get('/repComment/:id', repComment.getRepComment);
router.get(`/userComment/:id`,comment.userID);
router.put(`/addLike/:slug`,middlewareController.verifyToken,comment.addLikeComment);

module.exports = router;
