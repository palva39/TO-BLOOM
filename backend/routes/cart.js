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

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const carrito = db.carrito.findOrCreate(req.user.userId);
    const items = db.carrito.getItems(carrito.id);
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    db.carrito.updateTotal(carrito.id, total);
    
    res.json({ 
      carrito: { ...carrito, total },
      items 
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { producto_id, cantidad = 1 } = req.body;
    
    const carrito = db.carrito.findOrCreate(req.user.userId);
    
    // Check if product exists
    const product = db.product.findUnique({ where: { id: parseInt(producto_id) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if item already exists in cart
    const existingItems = db.carrito.getItems(carrito.id);
    const existingItem = existingItems.find(item => item.producto_id === parseInt(producto_id));
    
    if (existingItem) {
      // Update quantity
      db.carrito.updateItem(existingItem.id, existingItem.cantidad + cantidad);
    } else {
      // Add new item
      db.carrito.addItem(carrito.id, parseInt(producto_id), cantidad);
    }
    
    // Get updated items and calculate total
    const items = db.carrito.getItems(carrito.id);
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    db.carrito.updateTotal(carrito.id, total);
    
    res.json({ 
      message: 'Item added to cart',
      carrito: { ...carrito, total },
      items 
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item quantity
router.put('/items/:id', authenticateToken, async (req, res) => {
  try {
    const { cantidad } = req.body;
    const itemId = parseInt(req.params.id);
    
    if (cantidad <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }
    
    db.carrito.updateItem(itemId, cantidad);
    
    // Get updated cart info
    const carrito = db.carrito.findOrCreate(req.user.userId);
    const items = db.carrito.getItems(carrito.id);
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    db.carrito.updateTotal(carrito.id, total);
    
    res.json({ 
      message: 'Item quantity updated',
      carrito: { ...carrito, total },
      items 
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/items/:producto_id', authenticateToken, async (req, res) => {
  try {
    const productoId = parseInt(req.params.producto_id);
    const carrito = db.carrito.findOrCreate(req.user.userId);
    
    db.carrito.removeItem(carrito.id, productoId);
    
    // Get updated items and calculate total
    const items = db.carrito.getItems(carrito.id);
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    db.carrito.updateTotal(carrito.id, total);
    
    res.json({ 
      message: 'Item removed from cart',
      carrito: { ...carrito, total },
      items 
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;