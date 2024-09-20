const express = require('express');
const router = express.Router();
const repComment = require('../../../controler/repComment.controller');
const comment = require('../../../controler/comment.controller')
router.get('/getCommentAdmin', comment.getCommentAdmin);  
router.get(`/listDetailComment/:id`,comment.listDetailComment);
router.delete(`/repComment/:idRepComment`,repComment.deleteRepComment);
router.post('/repComment/:idComment', repComment.createRepComment);
router.get('/repComment/:id', repComment.getRepComment);
router.delete(`/:idProduct/:idComment`,comment.deleteComment);

module.exports = router;
