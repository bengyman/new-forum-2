const express = require('express');
const router = express.Router();
const postController = require('../../../server/controllers/post.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this line to import the fs module

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Ensure uploadDir points to 'forum-app\server\public\uploads'
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle creating a new post with an image upload
router.post('/', upload.single('image'), postController.createPost);

// Route to get all posts
router.get('/', postController.getAllPosts);

// Route to bring to single post HTML page
router.get('/page/:id', postController.getPostPage);

// Route to get a post by ID (JSON data)
router.get('/:id', postController.getPostById);

// Route to handle reporting a post
router.post('/:id/report', postController.reportPost);

module.exports = router;
