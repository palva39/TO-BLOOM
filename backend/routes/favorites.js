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
    const favoritos = db.favorito.findMany({ where: { usuario_id: req.user.userId } });
    res.json({ favoritos });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add product to favorites
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { producto_id } = req.body;
    
    if (!producto_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Check if product exists
    const product = db.product.findUnique({ where: { id: parseInt(producto_id) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if already in favorites
    const exists = db.favorito.exists(req.user.userId, parseInt(producto_id));
    if (exists) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }
    
    const favorito = db.favorito.create({
      data: {
        usuario_id: req.user.userId,
        producto_id: parseInt(producto_id)
      }
    });
    
    res.status(201).json({ 
      message: 'Product added to favorites',
      favorito 
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove product from favorites
router.delete('/:producto_id', authenticateToken, async (req, res) => {
  try {
    const productoId = parseInt(req.params.producto_id);
    
    // Check if in favorites
    const exists = db.favorito.exists(req.user.userId, productoId);
    if (!exists) {
      return res.status(404).json({ error: 'Product not in favorites' });
    }
    
    db.favorito.delete({ 
      where: { 
        usuario_id: req.user.userId, 
        producto_id: productoId 
      } 
    });
    
    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if product is in favorites
router.get('/check/:producto_id', authenticateToken, async (req, res) => {
  try {
    const productoId = parseInt(req.params.producto_id);
    const isFavorite = db.favorito.exists(req.user.userId, productoId);
    
    res.json({ isFavorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;