const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./models');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

async function syncDatabase() {
    try {
        await db.sequelize.sync({ alter: true });

        const [user, created] = await db.User.findOrCreate({
            where: { email: 'sampleuser@example.com' },
            defaults: { name: 'Sample User', password: 'password123' }
        });

        await db.Post.update({ userId: user.id }, { where: { userId: null } });

        await db.sequelize.query(`
            UPDATE posts SET userId = ${user.id} WHERE userId NOT IN (SELECT id FROM users)
        `);
        
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}


async function fetchPosts() {
    try {
        const response = await fetch('http://localhost:5000/api/posts');
        const posts = await response.json();

        console.log(posts); // Debug: Check the structure of posts data

        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = ''; // Clear any existing content

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';

            const datetimeElement = document.createElement('div');
            datetimeElement.className = 'datetime';
            datetimeElement.textContent = new Date(post.createdAt).toLocaleString();

            const titleElement = document.createElement('div');
            titleElement.className = 'title';
            titleElement.textContent = post.title;

            const residentElement = document.createElement('div');
            residentElement.className = 'resident';
            residentElement.textContent = post.resident.name; // Display resident name

            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.textContent = post.tags ? post.tags : 'No Tags'; // Ensure tags are displayed

            const contentElement = document.createElement('div');
            contentElement.className = 'content';
            contentElement.textContent = post.content;

            const reportButton = document.createElement('button');
            reportButton.className = 'report-button';
            reportButton.textContent = `Report`;
            reportButton.disabled = localStorage.getItem(`reported-${post.id}`) ? true : false;

            reportButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to report this post?')) {
                    await reportPost(post.id);
                    reportButton.disabled = true;
                    reportButton.textContent = `Report (${post.reports + 1})`;
                    localStorage.setItem(`reported-${post.id}`, true);
                }
            });

            postElement.appendChild(datetimeElement);
            postElement.appendChild(titleElement);
            postElement.appendChild(tagElement);
            postElement.appendChild(residentElement); // Append resident name

            if (post.imageUrl) {
                const imageAnchor = document.createElement('a');
                imageAnchor.href = `/posts/${post.id}`;
                imageAnchor.className = 'image-container';

                const imageElement = document.createElement('img');
                imageElement.src = post.imageUrl;
                imageElement.alt = 'Post Image';
                imageElement.className = 'post-image';
                
                imageAnchor.appendChild(imageElement);
                postElement.appendChild(imageAnchor);
            }

            postElement.appendChild(contentElement);
            postElement.appendChild(reportButton);
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

syncDatabase().then(() => {
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
});

// Route to serve posts.html
app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'posts.html'));
});

app.get('/', (req, res) => {
    res.send('Welcome to the forum application!');
});
