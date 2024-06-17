const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { sequelize } = require('./models');
const postController = require('./controllers/post.controller');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory in both client and server
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'client', 'src', 'public')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'client', 'src', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Routes
app.get('/api/posts', postController.getAllPosts);
app.post('/api/posts', upload.single('image'), postController.createPost);
app.get('/api/posts/:id', postController.getPostById);
app.post('/api/posts/:id/report', postController.reportPost);
app.put('/api/posts/:id', postController.updatePost); // Add this line
app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'posts.html'));
});
app.delete('/api/posts/:id', postController.deletePost);

// Sync database and start server
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = app;
