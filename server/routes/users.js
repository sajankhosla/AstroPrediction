const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUserData, getStatistics } = require('../utils/database');

// GET /api/users/all
// Get all users (admin endpoint)
router.get('/all', async (req, res) => {
  try {
    const users = await getAllUsers();
    
    res.json({
      success: true,
      count: users.length,
      users
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
});

// DELETE /api/users/:userId
// Delete user data
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await deleteUserData(userId);
    
    if (result) {
      res.json({
        success: true,
        message: 'User data deleted successfully'
      });
    } else {
      res.status(404).json({
        error: 'User not found'
      });
    }
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

// GET /api/users/statistics
// Get application statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await getStatistics();
    
    res.json({
      success: true,
      statistics: stats
    });
    
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve statistics',
      message: error.message
    });
  }
});

module.exports = router;
