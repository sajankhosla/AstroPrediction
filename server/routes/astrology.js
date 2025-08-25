const express = require('express');
const router = express.Router();
const VedicAstrologyEngine = require('../utils/vedicEngine');
const DeepSeekService = require('../utils/deepseekService');
const VercelAIService = require('../utils/vercelAIService');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

const astrologyEngine = new VedicAstrologyEngine();
const deepseekService = new DeepSeekService();
const vercelAIService = new VercelAIService();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /api/astrology/prediction
// Generate comprehensive prediction with positivity sinusoid
router.post('/prediction', async (req, res) => {
  // Optional authentication - work without token for demo
  let user = null;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token && token !== 'demo-token') {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      req.user = user;
    } catch (err) {
      // Continue without authentication for demo mode
      console.log('🎪 Demo mode: continuing without authentication');
    }
  }
  try {
    const {
      name,
      birthDate,
      birthTime,
      birthPlace,
      latitude,
      longitude,
      milestones = []
    } = req.body;

    // Validate required fields
    if (!name || !birthDate || !birthTime || !birthPlace || !latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'birthDate', 'birthTime', 'birthPlace', 'latitude', 'longitude']
      });
    }

    // Combine birth date and time
    const fullBirthDateTime = `${birthDate}T${birthTime}`;
    const targetDate = new Date(); // Current date for prediction

    // Generate comprehensive prediction
          console.log('Generating prediction for:', {
        name,
        birthDate: fullBirthDateTime,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        milestonesCount: milestones.length
      });
      
      const prediction = astrologyEngine.generatePrediction(
        fullBirthDateTime,
        targetDate,
        parseFloat(latitude),
        parseFloat(longitude),
        milestones
      );
      
      console.log('Prediction generated successfully:', {
        planetaryPositions: Object.keys(prediction.planetaryPositions || {}).length,
        aspects: (prediction.aspects || []).length,
        sinusoidDataPoints: (prediction.sinusoidData || []).length,
        milestoneAnalysis: (prediction.milestoneAnalysis || []).length
      });

      // Generate positive insights using Vercel AI (local processing)
      console.log('🤖 Generating positive insights with AI...');
      let enhancedPrediction;
      try {
        // Primary: Use Vercel AI service (runs locally on serverless)
        enhancedPrediction = await vercelAIService.enhancePredictionWithInsights(prediction);
        console.log('✅ Generated insights using Vercel AI Service (local processing)');
      } catch (error) {
        console.log('🔄 Vercel AI failed, trying DeepSeek fallback...', error.message);
        // Fallback: Use DeepSeek service if Vercel AI fails
        enhancedPrediction = await deepseekService.enhancePredictionWithInsights(prediction);
        console.log('✅ Generated insights using DeepSeek fallback');
      }

    // Save user data to database
    // Save prediction to database if user is authenticated
    let predictionId = null;
    if (req.user && req.user.userId) {
      try {
        predictionId = randomUUID();
        const positivityScore = prediction.positivityScore || 0;
        
        await req.db.runAsync(`
          INSERT INTO predictions (id, userId, predictionData, positivityScore, createdAt)
          VALUES (?, ?, ?, ?, ?)
        `, [predictionId, req.user.userId, JSON.stringify(enhancedPrediction), positivityScore, new Date().toISOString()]);
        
        console.log('✅ Prediction saved to database for user:', req.user.userId);
      } catch (error) {
        console.error('❌ Error saving prediction to database:', error);
        // Continue without saving - prediction still works
      }
    }

    res.json({
      success: true,
      predictionId,
      prediction: {
        ...enhancedPrediction,
        userInfo: {
          name,
          birthDate: fullBirthDateTime,
          birthPlace
        }
      }
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      error: 'Failed to generate prediction',
      message: error.message
    });
  }
});

// GET /api/astrology/user/:userId
// Retrieve user's prediction data
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's predictions from database
    const predictions = await req.db.allAsync(`
      SELECT id, predictionData, positivityScore, createdAt
      FROM predictions 
      WHERE userId = ? 
      ORDER BY createdAt DESC
    `, [userId]);

    if (!predictions || predictions.length === 0) {
      return res.status(404).json({
        error: 'No predictions found for this user'
      });
    }

    // Parse prediction data
    const userData = predictions.map(pred => ({
      id: pred.id,
      prediction: JSON.parse(pred.predictionData),
      positivityScore: pred.positivityScore,
      createdAt: pred.createdAt
    }));

    res.json({
      success: true,
      userData
    });

  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user data',
      message: error.message
    });
  }
});

// POST /api/astrology/update-milestones
// Update user's milestones and regenerate prediction
router.post('/update-milestones', authenticateToken, async (req, res) => {
  try {
    const { milestones, userInfo } = req.body;

    if (!milestones || !userInfo) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['milestones', 'userInfo']
      });
    }

    // Regenerate prediction with new milestones
    const updatedPrediction = astrologyEngine.generatePrediction(
      userInfo.birthDate,
      new Date(),
      userInfo.latitude || 0,
      userInfo.longitude || 0,
      milestones
    );

    // Save updated prediction
    const predictionId = randomUUID();
    const positivityScore = updatedPrediction.positivityScore || 0;
    
    await req.db.runAsync(`
      INSERT INTO predictions (id, userId, predictionData, positivityScore, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `, [predictionId, req.user.userId, JSON.stringify(updatedPrediction), positivityScore, new Date().toISOString()]);

    res.json({
      success: true,
      predictionId,
      prediction: {
        ...updatedPrediction,
        userInfo: userInfo
      }
    });

  } catch (error) {
    console.error('Update milestones error:', error);
    res.status(500).json({
      error: 'Failed to update milestones',
      message: error.message
    });
  }
});

// GET /api/astrology/planetary-positions
// Get current planetary positions
router.get('/planetary-positions', async (req, res) => {
  try {
    const { date, latitude, longitude } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    const lat = parseFloat(latitude) || 0;
    const lng = parseFloat(longitude) || 0;

    const positions = astrologyEngine.calculatePlanetaryPositions(targetDate, lat, lng);

    res.json({
      success: true,
      date: targetDate,
      positions
    });

  } catch (error) {
    console.error('Planetary positions error:', error);
    res.status(500).json({
      error: 'Failed to calculate planetary positions',
      message: error.message
    });
  }
});

// GET /api/astrology/positivity-score
// Calculate positivity score for a specific date
router.get('/positivity-score', async (req, res) => {
  try {
    const { birthDate, targetDate, latitude, longitude } = req.query;

    if (!birthDate || !targetDate || !latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['birthDate', 'targetDate', 'latitude', 'longitude']
      });
    }

    const score = astrologyEngine.calculatePositivityScore(
      new Date(birthDate),
      new Date(targetDate),
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.json({
      success: true,
      birthDate,
      targetDate,
      score,
      interpretation: astrologyEngine.getAlignmentDescription(score)
    });

  } catch (error) {
    console.error('Positivity score error:', error);
    res.status(500).json({
      error: 'Failed to calculate positivity score',
      message: error.message
    });
  }
});

// GET /api/astrology/sinusoid-data
// Generate positivity sinusoid data for visualization
router.get('/sinusoid-data', async (req, res) => {
  try {
    const { birthDate, endDate, latitude, longitude, dataPoints } = req.query;

    if (!birthDate || !endDate || !latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['birthDate', 'endDate', 'latitude', 'longitude']
      });
    }

    const sinusoidData = astrologyEngine.generatePositivitySinusoid(
      new Date(birthDate),
      new Date(endDate),
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(dataPoints) || 365
    );

    res.json({
      success: true,
      birthDate,
      endDate,
      dataPoints: sinusoidData.length,
      data: sinusoidData
    });

  } catch (error) {
    console.error('Sinusoid data error:', error);
    res.status(500).json({
      error: 'Failed to generate sinusoid data',
      message: error.message
    });
  }
});

module.exports = router;
