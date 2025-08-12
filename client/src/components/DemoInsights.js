import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Star, TrendingUp, Calendar, MapPin, Clock, User, ArrowLeft, Info } from 'lucide-react';

const DemoInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDemoInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/astrology/prediction', {
        name: "Demo User",
        birthDate: "1990-01-01",
        birthTime: "12:00",
        birthPlace: "Mumbai",
        latitude: 19.0760,
        longitude: 72.8777,
        milestones: [
          { description: "Graduated college", date: "2012-05-15" },
          { description: "Got first job", date: "2012-08-01" }
        ]
      });
      
      if (response.data.success) {
        setInsights(response.data.prediction);
      } else {
        throw new Error('Failed to generate insights');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error loading insights. Make sure the backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl text-white font-semibold">🌟 Calculating cosmic insights... 🌟</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500 text-white p-4 rounded-lg max-w-md">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button 
              onClick={loadDemoInsights}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {!insights ? (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                🌟 Cosmic Insights Demo 🌟
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience the power of Vedic astrology with real cosmic calculations
              </p>
              <button
                onClick={loadDemoInsights}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-full text-xl font-bold hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105"
              >
                Load Demo Cosmic Insights
              </button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">🌟 Your Cosmic Insights 🌟</h1>
              <button
                onClick={() => setInsights(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                ← Back to Demo
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Planetary Positions */}
              <div className="astrology-card">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Star className="mr-2" /> Planetary Positions
                </h2>
                <div className="space-y-3">
                  {Object.entries(insights.planetaryPositions).map(([planet, data]) => (
                    <div key={planet} className="planet-card">
                      <div className="planet-name">{planet}</div>
                      <div className="planet-position">
                        {data.longitude.toFixed(1)}° in House {data.house}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aspects */}
              <div className="astrology-card">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <TrendingUp className="mr-2" /> Planetary Aspects
                </h2>
                <div className="space-y-3">
                  {insights.aspects.map((aspect, index) => (
                    <div 
                      key={index} 
                      className={`aspect-item ${
                        aspect.influence > 0 ? 'harmonious' : 'challenging'
                      }`}
                    >
                      <div className="aspect-planets">
                        {aspect.planet1} {aspect.type} {aspect.planet2}
                      </div>
                      <div className="aspect-details">
                        {aspect.angle.toFixed(1)}° (Influence: {aspect.influence})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dasha */}
              <div className="astrology-card">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Calendar className="mr-2" /> Current Dasha
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-4">
                    {insights.dasha}
                  </div>
                  <p className="text-gray-300">
                    You are currently in a {insights.dasha} dasha period, which brings unique energies and opportunities for spiritual growth.
                  </p>
                </div>
              </div>

              {/* Positivity Score */}
              <div className="astrology-card">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <TrendingUp className="mr-2" /> Positivity Score
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-4">
                    {insights.positivityScore.toFixed(3)}
                  </div>
                  <p className="text-gray-300">
                    Moderate positive alignment with cosmic energies. Good time for balanced decision-making.
                  </p>
                </div>
              </div>
            </div>

            {/* Prediction */}
            <div className="astrology-card">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Info className="mr-2" /> Cosmic Prediction
              </h2>
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                <p className="text-white text-lg italic">
                  {insights.prediction}
                </p>
              </div>
            </div>

            {/* Life Cycle Data */}
            <div className="astrology-card">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <TrendingUp className="mr-2" /> Life Cycle Data
              </h2>
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6">
                <p className="text-white mb-4">
                  <strong>{insights.sinusoidData.length} data points</strong> generated from birth to present, showing your cosmic journey through time.
                </p>
                <p className="text-gray-300">
                  Each point represents your cosmic alignment on that specific date, creating a comprehensive view of your life's energetic patterns.
                </p>
              </div>
            </div>

            {/* Milestone Analysis */}
            {insights.milestoneAnalysis && insights.milestoneAnalysis.length > 0 && (
              <div className="astrology-card">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Calendar className="mr-2" /> Milestone Analysis
                </h2>
                <div className="space-y-4">
                  {insights.milestoneAnalysis.map((milestone, index) => (
                    <div key={index} className="milestone-item">
                      <div className="milestone-header">
                        <h3 className="text-lg font-semibold text-white">{milestone.description}</h3>
                        <span className="text-gray-400">{milestone.date}</span>
                      </div>
                      <div className="milestone-details">
                        <div className="positivity-score">
                          Score: {milestone.positivityScore.toFixed(3)}
                        </div>
                        <div className="alignment">
                          {milestone.alignment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DemoInsights;
