// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
// Create express application
const app = express();
// Add middleware to express application
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Create route to get comments
app.get('/posts/:id/comments', (req, res) => {
  // Return comments for post id
  res.send(commentsByPostId[req.params.id] || []);
});

// Create route to create comments
app.post('/posts/:id/comments', (req, res) => {
  // Create comment id
  const commentId = randomBytes(4).toString('hex');
  // Get comment content from request body
  const { content } = req.body;
  // Get comments for post id
  const comments = commentsByPostId[req.params.id] || [];
  // Add new comment to comments
  comments.push({ id: commentId, content, status: 'pending' });
  // Save comments
  commentsByPostId[req.params.id] = comments;
  // Send created comment
  res.status(201).send(comments);
});

// Create route to handle event
app.post('/events', (req, res) => {
  // Get event type and data from request body
  const { type, data } = req.body;
  // Check if event type is comment moderated
  if (type === 'CommentModerated') {
    // Get post id and comment id from comment moderated event data
    const { postId, id, status, content } = data;
    // Get comments for post id
    const comments = commentsByPostId[postId];
    // Find comment in comments
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    // Set comment status to moderated
    comment.status = status;
    // Emit comment updated event
    axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content,
      },
    });
  }
  // Send ok status
  res.send({});
});

// Listen on port 4001
app.listen(4001, () => {
  console.log('Listening on 4001');
});