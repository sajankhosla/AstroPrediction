import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Star, Calendar, MapPin, Clock, Plus, History, 
  Settings, LogOut, TrendingUp, Sparkles, Zap, Target,
  ArrowRight, Activity, BarChart3, Clock3, Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import moment from 'moment';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchRecentPredictions();
    }
  }, [user?.id]);

  const fetchRecentPredictions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/predictions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentPredictions(data.predictions?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    onLogout();
  };

  const quickActions = [
    {
      title: 'New Prediction',
      description: 'Create a fresh astrological reading',
      icon: <Plus className="w-6 h-6" />,
      color: 'from-purple-600 to-blue-600',
      action: () => navigate('/prediction')
    },
    {
      title: 'Birth Star Timeline',
      description: 'Explore your cosmic journey',
      icon: <History className="w-6 h-6" />,
      color: 'from-green-600 to-teal-600',
      action: () => navigate('/timeline')
    },
    {
      title: 'View Profile',
      description: 'Manage your account settings',
      icon: <User className="w-6 h-6" />,
      color: 'from-orange-600 to-red-600',
      action: () => navigate('/profile')
    }
  ];

  const stats = [
    {
      title: 'Total Predictions',
      value: recentPredictions.length,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      title: 'Member Since',
      value: user?.createdAt ? moment(user.createdAt).format('MMM YYYY') : 'N/A',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      title: 'Birth Star',
      value: 'Active',
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
              <p className="text-gray-300">Your cosmic journey awaits</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{stat.title}</p>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                onClick={action.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-left hover:bg-opacity-20 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{action.description}</p>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Predictions</h2>
            <button
              onClick={() => navigate('/profile')}
              className="text-purple-300 hover:text-purple-200 text-sm transition-colors duration-200"
            >
              View All
            </button>
          </div>
          
          {isLoading ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-8 text-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading your predictions...</p>
            </div>
          ) : recentPredictions.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-8 text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No predictions yet</h3>
              <p className="text-gray-300 mb-4">Start your cosmic journey by creating your first prediction!</p>
              <button
                onClick={() => navigate('/prediction')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                Create First Prediction
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {recentPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 hover:bg-opacity-20 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate('/results')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">
                      {moment(prediction.createdAt).format('MMM DD')}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2">
                    Prediction #{index + 1}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">
                        Score: {prediction.positivityScore || 'N/A'}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Your Birth Details</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-gray-300 text-sm">Name</p>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-gray-300 text-sm">Birth Date</p>
                <p className="text-white font-medium">
                  {user?.birthDate ? moment(user.birthDate).format('MMM DD, YYYY') : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-300 text-sm">Birth Time</p>
                <p className="text-white font-medium">{user?.birthTime || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-gray-300 text-sm">Birth Place</p>
                <p className="text-white font-medium">{user?.birthPlace || 'N/A'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
