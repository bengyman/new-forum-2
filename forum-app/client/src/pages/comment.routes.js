const express = require('express');
const router = express.Router();
const commentController = require('../../../server/controllers/comment.controller');

router.post('/', commentController.createComment);
router.get('/post/:postId', commentController.getCommentsByPostId);

module.exports = router;