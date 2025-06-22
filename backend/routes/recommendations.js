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

// Get user's recommendations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const recomendaciones = db.recomendacion.findMany({ where: { usuario_id: req.user.userId } });
    res.json({ recomendaciones });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all recommendations (admin only)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    // Note: In a real app, you'd check if user is admin
    // For now, allowing all authenticated users to see all recommendations
    const recomendaciones = db.recomendacion.findMany({});
    res.json({ recomendaciones });
  } catch (error) {
    console.error('Get all recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create recommendation (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { usuario_id, producto_id, mensaje } = req.body;
    
    if (!usuario_id || !producto_id) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }
    
    // Check if user exists
    const user = db.user.findUnique({ where: { id: parseInt(usuario_id) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if product exists
    const product = db.product.findUnique({ where: { id: parseInt(producto_id) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const recomendacion = db.recomendacion.create({
      data: {
        admin_id: req.user.userId,
        usuario_id: parseInt(usuario_id),
        producto_id: parseInt(producto_id),
        mensaje: mensaje || ''
      }
    });
    
    res.status(201).json({ 
      message: 'Recommendation created successfully',
      recomendacion 
    });
  } catch (error) {
    console.error('Create recommendation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;