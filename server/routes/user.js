const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get user predictions
router.get('/predictions', authenticateToken, async (req, res) => {
  try {
    const predictions = await req.db.allAsync(`
      SELECT id, userId, predictionData, positivityScore, createdAt
      FROM predictions 
      WHERE userId = ? 
      ORDER BY createdAt DESC
    `, [req.user.userId]);

    res.json({ predictions });

  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific prediction
router.get('/predictions/:id', authenticateToken, async (req, res) => {
  try {
    const prediction = await req.db.getAsync(`
      SELECT id, userId, predictionData, positivityScore, createdAt
      FROM predictions 
      WHERE id = ? AND userId = ?
    `, [req.params.id, req.user.userId]);

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.json({ prediction });

  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Save prediction
router.post('/predictions', authenticateToken, async (req, res) => {
  try {
    const { predictionData, positivityScore } = req.body;

    if (!predictionData) {
      return res.status(400).json({ message: 'Prediction data is required' });
    }

    const predictionId = require('crypto').randomUUID();
    const createdAt = new Date().toISOString();

    await req.db.runAsync(`
      INSERT INTO predictions (id, userId, predictionData, positivityScore, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `, [predictionId, req.user.userId, JSON.stringify(predictionData), positivityScore || 0, createdAt]);

    res.status(201).json({
      message: 'Prediction saved successfully',
      prediction: {
        id: predictionId,
        userId: req.user.userId,
        predictionData,
        positivityScore: positivityScore || 0,
        createdAt
      }
    });

  } catch (error) {
    console.error('Save prediction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete prediction
router.delete('/predictions/:id', authenticateToken, async (req, res) => {
  try {
    const result = await req.db.runAsync(`
      DELETE FROM predictions 
      WHERE id = ? AND userId = ?
    `, [req.params.id, req.user.userId]);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.json({ message: 'Prediction deleted successfully' });

  } catch (error) {
    console.error('Delete prediction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await req.db.getAsync(`
      SELECT id, name, email, birthDate, birthTime, birthPlace, latitude, longitude, createdAt 
      FROM users 
      WHERE id = ?
    `, [req.user.userId]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, birthDate, birthTime, birthPlace, latitude, longitude } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await req.db.getAsync('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.userId]);
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Update user
    await req.db.runAsync(`
      UPDATE users 
      SET name = COALESCE(?, name), 
          email = COALESCE(?, email), 
          birthDate = COALESCE(?, birthDate), 
          birthTime = COALESCE(?, birthTime), 
          birthPlace = COALESCE(?, birthPlace), 
          latitude = COALESCE(?, latitude), 
          longitude = COALESCE(?, longitude)
      WHERE id = ?
    `, [name, email, birthDate, birthTime, birthPlace, latitude, longitude, req.user.userId]);

    // Get updated user
    const user = await req.db.getAsync(`
      SELECT id, name, email, birthDate, birthTime, birthPlace, latitude, longitude, createdAt 
      FROM users 
      WHERE id = ?
    `, [req.user.userId]);

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    // Get current user with password
    const user = await req.db.getAsync('SELECT password FROM users WHERE id = ?', [req.user.userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await req.db.runAsync('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.userId]);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
