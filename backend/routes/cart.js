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

// Calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
};

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = db.cart.findOrCreate({ userId: req.user.userId });
    const items = db.cart.findItems({ cartId: cart.id });
    const total = calculateCartTotal(items);
    
    // Update cart total
    db.cart.updateTotal({ cartId: cart.id, total });
    
    res.json({
      cart: { ...cart, total },
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
    const { productId, cantidad = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Check if product exists
    const product = db.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const cart = db.cart.findOrCreate({ userId: req.user.userId });
    const result = db.cart.addItem({ 
      cartId: cart.id, 
      productId: parseInt(productId), 
      cantidad: parseInt(cantidad) 
    });
    
    // Recalculate total
    const items = db.cart.findItems({ cartId: cart.id });
    const total = calculateCartTotal(items);
    db.cart.updateTotal({ cartId: cart.id, total });
    
    res.status(201).json({ 
      message: 'Item added to cart',
      item: result
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item quantity
router.put('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { cantidad } = req.body;
    
    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    
    db.cart.updateItem({ itemId, cantidad: parseInt(cantidad) });
    
    // Recalculate total
    const cart = db.cart.findOrCreate({ userId: req.user.userId });
    const items = db.cart.findItems({ cartId: cart.id });
    const total = calculateCartTotal(items);
    db.cart.updateTotal({ cartId: cart.id, total });
    
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    
    db.cart.removeItem({ itemId });
    
    // Recalculate total
    const cart = db.cart.findOrCreate({ userId: req.user.userId });
    const items = db.cart.findItems({ cartId: cart.id });
    const total = calculateCartTotal(items);
    db.cart.updateTotal({ cartId: cart.id, total });
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const cart = db.cart.findOrCreate({ userId: req.user.userId });
    db.cart.clear({ cartId: cart.id });
    db.cart.updateTotal({ cartId: cart.id, total: 0 });
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;