const express = require('express');
const db = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = db.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = db.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new post (auth required)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, published = false } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const post = db.post.create({
      data: {
        title,
        content,
        published,
        authorId: req.user.userId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update post (auth required, only author can update)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    // Check if post exists and user is the author
    const existingPost = db.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    const updatedPost = db.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published })
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete post (auth required, only author can delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists and user is the author
    const existingPost = db.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    db.post.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;