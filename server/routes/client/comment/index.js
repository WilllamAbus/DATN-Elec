const express = require('express');
const router = express.Router();
const comment = require('../../../controler/comment.controller');
const repComment = require('../../../controler/repComment.controller');
router.post('/addComment/:id',comment.addCommentProduct);//bỏ mindewre ở đây
router.get('/:id', comment.getCommentProduct);
router.post('/repComment/:id',repComment.repComment);
router.get('/repComment/:id', repComment.getRepComment);
router.get(`/userComment/:id`,comment.userID);

module.exports = router;
