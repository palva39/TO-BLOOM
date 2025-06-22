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
    const recommendations = db.recommendation.findMany({ where: { usuario_id: req.user.userId } });
    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create recommendation (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { usuarioId, productoId, mensaje } = req.body;
    
    // Check if user is admin
    const user = db.user.findUnique({ where: { id: req.user.userId } });
    if (!user || user.rol !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    
    if (!usuarioId || !productoId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }
    
    // Check if target user exists
    const targetUser = db.user.findUnique({ where: { id: parseInt(usuarioId) } });
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }
    
    // Check if product exists
    const product = db.product.findUnique({ where: { id: parseInt(productoId) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const recommendation = db.recommendation.create({
      data: {
        admin_id: req.user.userId,
        usuario_id: parseInt(usuarioId),
        producto_id: parseInt(productoId),
        mensaje
      }
    });
    
    res.status(201).json({
      message: 'Recommendation created successfully',
      recommendation
    });
  } catch (error) {
    console.error('Create recommendation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark recommendation as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const recommendationId = parseInt(req.params.id);
    
    // Verify recommendation belongs to user (optional check for security)
    db.recommendation.markAsRead({ id: recommendationId });
    
    res.json({ message: 'Recommendation marked as read' });
  } catch (error) {
    console.error('Mark recommendation as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;