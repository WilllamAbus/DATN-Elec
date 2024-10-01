const express = require('express');
const router = express.Router();
const comment = require('../../../controler/comment.controller');
const repComment = require('../../../controler/repComment.controller');
const middlewareController = require("../../../middleware/auth");
router.post('/addComment/:id',middlewareController.verifyToken,comment.addCommentProduct);
router.get('/:id', comment.getCommentProduct);
router.get('/repComment/:id', repComment.getRepComment);
router.get(`/userComment/:id`,comment.userID);


module.exports = router;
