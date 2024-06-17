const db = require('../models');

exports.createComment = async (req, res) => {
    try {
        const comment = await db.Comment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    try {
        const comments = await db.Comment.findAll({
            where: { PostId: req.params.postId }
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};