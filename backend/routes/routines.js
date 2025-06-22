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

// Get user's routines
router.get('/', authenticateToken, async (req, res) => {
  try {
    const routines = db.routine.findMany({ where: { usuario_id: req.user.userId } });
    res.json(routines);
  } catch (error) {
    console.error('Get routines error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single routine
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const routineId = parseInt(req.params.id);
    const routine = db.routine.findUnique({ where: { id: routineId } });
    
    if (!routine) {
      return res.status(404).json({ error: 'Routine not found' });
    }
    
    // Check if routine belongs to user
    if (routine.usuario_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(routine);
  } catch (error) {
    console.error('Get routine error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create routine
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, tipo, pasos } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'Routine name is required' });
    }
    
    const routine = db.routine.create({
      data: {
        usuario_id: req.user.userId,
        nombre,
        tipo,
        pasos: pasos || []
      }
    });
    
    res.status(201).json(routine);
  } catch (error) {
    console.error('Create routine error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update routine
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const routineId = parseInt(req.params.id);
    const { nombre, tipo, pasos } = req.body;
    
    // Check if routine exists and belongs to user
    const existingRoutine = db.routine.findUnique({ where: { id: routineId } });
    if (!existingRoutine) {
      return res.status(404).json({ error: 'Routine not found' });
    }
    
    if (existingRoutine.usuario_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const routine = db.routine.update({
      where: { id: routineId },
      data: { nombre, tipo, pasos }
    });
    
    res.json(routine);
  } catch (error) {
    console.error('Update routine error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete routine
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const routineId = parseInt(req.params.id);
    
    // Check if routine exists and belongs to user
    const existingRoutine = db.routine.findUnique({ where: { id: routineId } });
    if (!existingRoutine) {
      return res.status(404).json({ error: 'Routine not found' });
    }
    
    if (existingRoutine.usuario_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    db.routine.delete({ where: { id: routineId } });
    res.json({ message: 'Routine deleted successfully' });
  } catch (error) {
    console.error('Delete routine error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;