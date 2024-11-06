const express = require('express');
const router = express.Router();
const comment = require('../../../controler/comment.controller');
const repComment = require('../../../controler/repComment.controller');
const middlewareController = require("../../../middleware/auth");
router.post('/addComment/:slug',middlewareController.verifyToken,comment.addCommentProduct);
router.get('/:slug', comment.getCommentProduct);
router.get('/repComment/:id', repComment.getRepComment);
router.get(`/userComment/:id`,comment.userID);


module.exports = router;
