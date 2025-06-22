const express = require('express');
const db = require('../db');

const router = express.Router();

// Middleware to verify JWT token (copied from auth.js)
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
    const products = db.product.findMany({});
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = db.product.findUnique({ where: { id: productId } });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categoria } = req.body;
    
    // Check if user is admin
    const user = db.user.findUnique({ where: { id: req.user.userId } });
    if (!user || user.rol !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre and precio are required' });
    }
    
    const product = db.product.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        imagen_url,
        categoria
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { nombre, descripcion, precio, imagen_url, categoria } = req.body;
    
    // Check if user is admin
    const user = db.user.findUnique({ where: { id: req.user.userId } });
    if (!user || user.rol !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    
    const product = db.product.update({
      where: { id: productId },
      data: {
        nombre,
        descripcion,
        precio: precio ? parseFloat(precio) : undefined,
        imagen_url,
        categoria
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Check if user is admin
    const user = db.user.findUnique({ where: { id: req.user.userId } });
    if (!user || user.rol !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    
    db.product.delete({ where: { id: productId } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;