const express = require('express');
const db = require('../db');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Get user's favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = db.favorite.findMany({ where: { usuario_id: req.user.userId } });
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add product to favorites
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Check if product exists
    const product = db.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if already favorited
    const existing = db.favorite.check({ userId: req.user.userId, productId: parseInt(productId) });
    if (existing) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }
    
    const favorite = db.favorite.add({ 
      userId: req.user.userId, 
      productId: parseInt(productId) 
    });
    
    res.status(201).json({ 
      message: 'Product added to favorites',
      favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove product from favorites
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    
    // Check if favorite exists
    const existing = db.favorite.check({ userId: req.user.userId, productId });
    if (!existing) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    db.favorite.remove({ userId: req.user.userId, productId });
    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if product is favorited
router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const favorite = db.favorite.check({ userId: req.user.userId, productId });
    
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;