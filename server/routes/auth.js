const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { randomUUID } = require('crypto');
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

// Register new user
router.post('/register', async (req, res) => {
  console.log('🔐 Registration request received:', { 
    name: req.body.name, 
    email: req.body.email, 
    hasPassword: !!req.body.password,
    birthDate: req.body.birthDate,
    birthTime: req.body.birthTime,
    birthPlace: req.body.birthPlace
  });
  
  try {
    const { name, email, password, birthDate, birthTime, birthPlace, latitude, longitude } = req.body;

    // Validate required fields
    if (!name || !email || !password || !birthDate || !birthTime || !birthPlace) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('🔍 Checking if user already exists...');
    // Check if user already exists
    const existingUser = await req.db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      console.log('❌ User already exists');
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    console.log('🔐 Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('🆔 Generating user ID...');
    // Create user
    const userId = randomUUID();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      birthDate,
      birthTime,
      birthPlace,
      latitude: latitude || null,
      longitude: longitude || null,
      createdAt: new Date().toISOString()
    };

    console.log('💾 Saving user to database...');
    await req.db.runAsync(`
      INSERT INTO users (id, name, email, password, birthDate, birthTime, birthPlace, latitude, longitude, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [user.id, user.name, user.email, user.password, user.birthDate, user.birthTime, user.birthPlace, user.latitude, user.longitude, user.createdAt]);

    console.log('🎫 Creating JWT token...');
    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Remove password from response
    delete user.password;

    console.log('✅ Registration successful for:', user.email);
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await req.db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await req.db.getAsync('SELECT id, name, email, birthDate, birthTime, birthPlace, latitude, longitude, createdAt FROM users WHERE id = ?', [req.user.userId]);
    
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
    const user = await req.db.getAsync('SELECT id, name, email, birthDate, birthTime, birthPlace, latitude, longitude, createdAt FROM users WHERE id = ?', [req.user.userId]);

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

// Google OAuth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Create JWT token for the user
      const token = jwt.sign({ userId: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      // Remove sensitive data
      const user = { ...req.user };
      delete user.password;
      delete user.googleId;
      delete user.facebookId;

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('/login?error=oauth_failed');
    }
  }
);

// Facebook OAuth Routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Create JWT token for the user
      const token = jwt.sign({ userId: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      // Remove sensitive data
      const user = { ...req.user };
      delete user.password;
      delete user.googleId;
      delete user.facebookId;

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (error) {
      console.error('Facebook OAuth callback error:', error);
      res.redirect('/login?error=oauth_failed');
    }
  }
);

// OAuth success endpoint (for frontend to call)
router.get('/oauth/success', (req, res) => {
  if (req.user) {
    const user = { ...req.user };
    delete user.password;
    delete user.googleId;
    delete user.facebookId;
    
    const token = jwt.sign({ userId: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      user,
      token
    });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

module.exports = router;
