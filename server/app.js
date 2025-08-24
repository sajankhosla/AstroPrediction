const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

const astrologyRoutes = require('./routes/astrology');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const db = require('./utils/database');
const configurePassport = require('./config/passport');

const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req, res) => {
      // On Vercel, req.ip is derived from X-Forwarded-For when trust proxy is enabled
      return req.ip || req.headers['x-real-ip'] || 'global';
    }
  });
  app.use(limiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Session middleware for OAuth
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport strategies
  configurePassport(db);

  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.use('/api/astrology', astrologyRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Vedic Astrology Engine is running' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      error: 'Something went wrong!',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });

  return app;
};

module.exports = createApp;


