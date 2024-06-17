const { Post, Resident } = require('../models');
const path = require('path');

const postController = {
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.findAll({
                include: [{
                    model: Resident,
                    as: 'resident',
                    attributes: ['name']
                }],
                attributes: ['post_id', 'title', 'content', 'tags', 'imageUrl', 'reports', 'createdAt']
            });
            res.json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'An error occurred while fetching posts' });
        }
    },

    createPost: async (req, res) => {
        const { title, content, tags, residentId } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        try {
            if (!residentId || isNaN(residentId)) {
                return res.status(400).json({ error: 'Invalid residentId provided' });
            }

            const post = await Post.create({ title, content, tags, resident_id: residentId, imageUrl });
            res.status(201).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'An error occurred while creating the post' });
        }
    },

    getPostPage: async (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'post.html'));
    },

    getPostById: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [{
                    model: Resident,
                    as: 'resident',
                    attributes: ['name']
                }]
            });

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.json(post);
        } catch (error) {
            console.error('Error fetching post:', error);
            res.status(500).json({ error: 'An error occurred while fetching the post' });
        }
    },

    reportPost: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            post.reports += 1;
            await post.save();

            res.json({ message: 'Post reported successfully' });
        } catch (error) {
            console.error('Error reporting post:', error);
            res.status(500).json({ error: 'An error occurred while reporting the post' });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            await post.destroy();
            res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ error: 'An error occurred while deleting the post' });
        }
    },

    updatePost: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const { title, content } = req.body;

            post.title = title;
            post.content = content;
            await post.save();

            res.json({ message: 'Post updated successfully', post });
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ error: 'An error occurred while updating the post' });
        }
    }
};

module.exports = postController;
