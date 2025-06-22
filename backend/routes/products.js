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

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = db.product.findMany();
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = db.product.findUnique({ where: { id: parseInt(req.params.id) } });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categoria } = req.body;
    
    // Check if user is admin (you might want to implement proper role checking)
    // For now, allowing all authenticated users to create products
    
    const product = db.product.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        imagen_url,
        categoria
      }
    });
    
    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categoria } = req.body;
    
    const product = db.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        imagen_url,
        categoria
      }
    });
    
    res.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    db.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;