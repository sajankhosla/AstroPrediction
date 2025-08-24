import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Scatter, ReferenceLine
} from 'recharts';
import { 
  Star, TrendingUp, Calendar, MapPin, Clock, User, ArrowLeft, 
  Info, History, Plus, Book
} from 'lucide-react';
import moment from 'moment';
import PlanetaryVisualization from './PlanetaryVisualization';
import BirthStarTimeline from './BirthStarTimeline';
import AddMilestonesModal from './AddMilestonesModal';
import AstroChart from './AstroChart';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAddMilestonesModal, setShowAddMilestonesModal] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('predictionData');
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('Prediction Data:', parsedData);
      setPredictionData(parsedData);
    } else {
      console.log('No prediction data found, redirecting to form');
      navigate('/prediction');
    }
  }, [navigate]);

  const handleMilestonesAdded = (updatedPredictionData) => {
    setPredictionData(updatedPredictionData);
  };

  if (!predictionData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const prediction = predictionData.prediction || {};
  const userInfo = prediction.userInfo || {};
  
  console.log('Full predictionData:', predictionData);
  console.log('Prediction object:', prediction);
  console.log('UserInfo:', userInfo);
  
  const { 
    sinusoidData = [], 
    milestoneAnalysis = [], 
    planetaryPositions = {}, 
    aspects = [], 
    dasha = 'UNKNOWN', 
    positivityScore = 0,
    adjustedPositivityScore = null,
    classicalInsights = {},
    futureProjections = [],
    sinusoidalTrend = null,
    positiveInsights = null,
    spiritualProfile = null
  } = prediction || {};
  
  console.log('Extracted data:', {
    sinusoidDataLength: sinusoidData.length,
    milestoneAnalysisLength: milestoneAnalysis.length,
    planetaryPositionsKeys: Object.keys(planetaryPositions),
    aspectsLength: aspects.length,
    dasha,
    positivityScore,
    futureProjectionsLength: futureProjections.length,
    hasSinusoidalTrend: !!sinusoidalTrend
  });

  // Prepare chart data
  const chartData = (sinusoidData || []).map(point => ({
    date: moment(point.date).format('MMM YYYY'),
    positivityScore: point.score,
    timestamp: point.timestamp
  }));

  // Prepare milestone data for scatter plot
  const milestoneData = (milestoneAnalysis || []).map(milestone => ({
    date: moment(milestone.date).format('MMM YYYY'),
    positivityScore: milestone.positivityScore,
    description: milestone.description,
    timestamp: moment(milestone.date).valueOf()
  }));

  // Combine sinusoid and milestone data
  const combinedData = (chartData || []).map(point => {
    const milestone = (milestoneData || []).find(m => 
      Math.abs(m.timestamp - point.timestamp) < 30 * 24 * 60 * 60 * 1000 // Within 30 days
    );
    return {
      ...point,
      milestone: milestone ? milestone.description : null,
      milestoneScore: milestone ? milestone.positivityScore : null
    };
  });

  // Get positivity level description
  const getPositivityLevel = (score) => {
    if (score >= 0.7) return { level: 'Excellent', color: 'text-green-400', bg: 'bg-green-500' };
    if (score >= 0.4) return { level: 'Good', color: 'text-blue-400', bg: 'bg-blue-500' };
    if (score >= 0.1) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    if (score >= -0.2) return { level: 'Challenging', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { level: 'Difficult', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const positivityLevel = getPositivityLevel(positivityScore);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-purple-300">
            Positivity Score: {payload[0].value.toFixed(3)}
          </p>
          {payload[0].payload.milestone && (
            <p className="text-green-300 text-sm">
              Milestone: {payload[0].payload.milestone}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Your Cosmic Insights
            </h1>
            <p className="text-xl text-gray-300">
              Discover how your life events align with cosmic energy cycles
            </p>
          </div>
          
                              <div className="flex space-x-4">
          <button
            onClick={() => setShowTimeline(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center"
          >
            <History className="w-4 h-4 mr-2" />
            Birth Star Timeline
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => navigate('/prediction')}
            className="px-4 py-2 border border-purple-500 text-purple-300 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-200 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Reading
          </button>
        </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="astrology-card mb-8"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center">
              <User className="w-6 h-6 text-purple-400 mr-3" />
              <div>
                <p className="text-gray-300 text-sm">Name</p>
                <p className="text-white font-semibold">{userInfo?.name || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-purple-400 mr-3" />
              <div>
                <p className="text-gray-300 text-sm">Birth Date</p>
                <p className="text-white font-semibold">
                  {userInfo?.birthDate ? moment(userInfo.birthDate).format('MMM DD, YYYY') : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-purple-400 mr-3" />
              <div>
                <p className="text-gray-300 text-sm">Birth Time</p>
                <p className="text-white font-semibold">
                  {userInfo?.birthDate ? moment(userInfo.birthDate).format('HH:mm') : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-purple-400 mr-3" />
              <div>
                <p className="text-gray-300 text-sm">Birth Place</p>
                <p className="text-white font-semibold">{userInfo?.birthPlace || 'N/A'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 mb-8 bg-gray-800 bg-opacity-50 rounded-lg p-1"
        >
          {[
            { id: 'overview', label: 'Overview', icon: Star },
            ...(positiveInsights ? [{ id: 'insights', label: '🤖 AI Insights', icon: Star }] : []),
            { id: 'chart', label: 'Positivity Chart', icon: TrendingUp },
            { id: 'astro', label: 'Astronomical Chart', icon: Star },
            { id: 'planets', label: 'Planetary Positions', icon: Star },
            { id: 'milestones', label: 'Milestones', icon: Calendar },
            { id: 'classics', label: 'Classical Insights', icon: Book }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.id === 'milestones' && (milestoneAnalysis || []).length > 0 && (
                <span className="ml-2 bg-purple-400 text-white text-xs px-2 py-1 rounded-full">
                  {milestoneAnalysis.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Current Status */}
              <div className="astrology-card">
                <h2 className="text-2xl font-semibold text-white mb-6">Current Cosmic Status</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                    <div>
                      <p className="text-gray-300 text-sm">Positivity Score</p>
                      <p className={`text-2xl font-bold ${positivityLevel.color}`}>
                        {positivityScore.toFixed(3)}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${positivityLevel.bg}`}></div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                    <div>
                      <p className="text-gray-300 text-sm">Current Dasha</p>
                      <p className="text-xl font-semibold text-white">{dasha}</p>
                    </div>
                    <Star className="w-6 h-6 text-purple-400" />
                  </div>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                    <p className="text-gray-300 text-sm mb-2">Prediction</p>
                    <p className="text-white">{prediction?.prediction || 'No prediction available'}</p>
                  </div>
                </div>
              </div>

              {/* Quick Chart */}
              <div className="astrology-card">
                <h2 className="text-2xl font-semibold text-white mb-6">Positivity Overview</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={(chartData || []).slice(-30)}> {/* Last 30 points */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        domain={[-1, 1]}
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="positivityScore" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Tab */}
          {activeTab === 'insights' && positiveInsights && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-300/30">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                  🤖✨ AI-Powered Positive Insights
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-yellow-300 mb-3">🌟 Your Strengths</h3>
                    <ul className="space-y-2">
                      {positiveInsights.strengths?.map((strength, index) => (
                        <li key={index} className="text-green-200 flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">🚀 Growth Opportunities</h3>
                    <ul className="space-y-2">
                      {positiveInsights.opportunities?.map((opportunity, index) => (
                        <li key={index} className="text-blue-200 flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">💫 Your Cosmic Summary</h3>
                  <p className="text-gray-200 leading-relaxed">{positiveInsights.summary}</p>
                </div>

                {positiveInsights.recommendations && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-orange-300 mb-2">🧘 Spiritual</h4>
                      <ul className="space-y-1 text-sm">
                        {positiveInsights.recommendations.spiritual_practices?.map((practice, index) => (
                          <li key={index} className="text-orange-200">• {practice}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-pink-300 mb-2">💼 Career</h4>
                      <ul className="space-y-1 text-sm">
                        {positiveInsights.recommendations.career?.map((advice, index) => (
                          <li key={index} className="text-pink-200">• {advice}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-green-300 mb-2">💝 Relationships</h4>
                      <ul className="space-y-1 text-sm">
                        {positiveInsights.recommendations.relationships?.map((advice, index) => (
                          <li key={index} className="text-green-200">• {advice}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2">🌅 Daily Life</h4>
                      <ul className="space-y-1 text-sm">
                        {positiveInsights.recommendations.daily_life?.map((advice, index) => (
                          <li key={index} className="text-cyan-200">• {advice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {positiveInsights.timing_guidance && (
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-4 mb-4">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">⏰ Cosmic Timing</h4>
                    <p className="text-indigo-100">{positiveInsights.timing_guidance}</p>
                  </div>
                )}

                {positiveInsights.encouragement && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-300/30">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">🌈 Encouragement</h4>
                    <p className="text-yellow-100 leading-relaxed font-medium">{positiveInsights.encouragement}</p>
                  </div>
                )}
              </div>

              {spiritualProfile && (
                <div className="astrology-card">
                  <h3 className="text-2xl font-semibold text-white mb-4">🕉️ Spiritual Profile</h3>
                  
                  {spiritualProfile.birth_moon_nakshatra && (
                    <div className="mb-4 p-4 bg-purple-500/20 rounded-lg">
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">Birth Moon Nakshatra</h4>
                      <p className="text-white font-medium">{spiritualProfile.birth_moon_nakshatra.name}</p>
                      <p className="text-gray-300 text-sm mt-1">{spiritualProfile.spiritual_path}</p>
                    </div>
                  )}

                  {spiritualProfile.spiritual_gifts && spiritualProfile.spiritual_gifts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Spiritual Gifts</h4>
                      <ul className="space-y-1">
                        {spiritualProfile.spiritual_gifts.map((gift, index) => (
                          <li key={index} className="text-green-200 flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            {gift}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Chart Tab */}
          {activeTab === 'chart' && (
            <div className="astrology-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Positivity Sinusoid & Milestone Alignment</h2>
              
              <div className="mb-6 p-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-semibold mb-1">Understanding Your Chart</p>
                    <p className="text-gray-300 text-sm">
                      The sinusoidal line represents your cosmic positivity cycles. Notice how your positive milestones 
                      align with the peaks of your astrological positivity cycle. The peaks indicate periods of highly 
                      favorable transits, while troughs represent challenging periods that offer growth opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="chart-container">
                                 <ResponsiveContainer width="100%" height={500}>
                   <LineChart data={combinedData || []}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                     <XAxis 
                       dataKey="date" 
                       stroke="#9CA3AF"
                       fontSize={12}
                       angle={-45}
                       textAnchor="end"
                     />
                     <YAxis 
                       stroke="#9CA3AF"
                       domain={[-1, 1]}
                       fontSize={12}
                     />
                     <Tooltip content={<CustomTooltip />} />
                     <Legend />
                     
                     {/* Sinusoid Line */}
                     <Line 
                       type="monotone" 
                       dataKey="positivityScore" 
                       stroke="#8B5CF6" 
                       strokeWidth={3}
                       dot={false}
                       name="Cosmic Positivity"
                     />
                     
                     {/* Milestone Points */}
                     <Scatter 
                       dataKey="milestoneScore" 
                       fill="#10B981" 
                       stroke="#10B981"
                       strokeWidth={2}
                       r={6}
                       name="Life Milestones"
                     />
                     
                     {/* Reference Lines */}
                     <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
                     <ReferenceLine y={0.5} stroke="#10B981" strokeDasharray="3 3" />
                     <ReferenceLine y={-0.5} stroke="#EF4444" strokeDasharray="3 3" />
                   </LineChart>
                 </ResponsiveContainer>
              </div>

              {/* Milestone-to-wave alignment analysis */}
              <div className="mt-6 p-4 bg-purple-900 bg-opacity-30 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Milestone Alignment Analysis</h3>
                {(() => {
                  const windowDays = 15; // +/- window for matching peaks/troughs
                  const points = sinusoidData || [];
                  if (!points.length || !(milestoneAnalysis || []).length) {
                    return <p className="text-gray-300 text-sm">No data yet. Add milestones or generate predictions.</p>;
                  }
                  function nearestPoint(ts) {
                    let best = null;
                    for (const p of points) {
                      const dt = Math.abs(new Date(p.date).getTime() - new Date(ts).getTime());
                      if (!best || dt < best.dt) best = { p, dt };
                    }
                    return best;
                  }
                  function findLocalExtrema(idx) {
                    // approximate local maxima/minima by comparing neighbors
                    const prev = points[idx - 1];
                    const curr = points[idx];
                    const next = points[idx + 1];
                    if (!prev || !next) return null;
                    if (curr.score > prev.score && curr.score > next.score) return { type: 'peak', value: curr.score };
                    if (curr.score < prev.score && curr.score < next.score) return { type: 'trough', value: curr.score };
                    return null;
                  }
                  let aligned = 0;
                  const rows = (milestoneAnalysis || []).map(ms => {
                    const near = nearestPoint(ms.date);
                    const idx = points.findIndex(p => p.date === near.p.date);
                    const ex = findLocalExtrema(idx);
                    const daysDiff = Math.round(near.dt / (24*3600*1000));
                    const close = Math.abs(daysDiff) <= windowDays;
                    const alignment = close && ex ? (ex.type === 'peak' ? 'Near Peak' : 'Near Trough') : 'Neutral';
                    if (close && ex) aligned++;
                    return { ...ms, matchedDate: near.p.date, waveScore: near.p.score, daysDiff, alignment };
                  });
                  const pct = Math.round((aligned / rows.length) * 100);
                  return (
                    <div>
                      <p className="text-gray-300 text-sm mb-3">Within ±{windowDays} days, {aligned}/{rows.length} milestones ({pct}%) align with nearby wave peaks/troughs.</p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-200">
                          <thead>
                            <tr className="text-gray-400">
                              <th className="text-left pr-4 py-2">Date</th>
                              <th className="text-left pr-4 py-2">Description</th>
                              <th className="text-left pr-4 py-2">Wave Score</th>
                              <th className="text-left pr-4 py-2">Δ Days</th>
                              <th className="text-left pr-4 py-2">Alignment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r, i) => (
                              <tr key={i} className="border-t border-gray-700">
                                <td className="pr-4 py-2">{r.matchedDate}</td>
                                <td className="pr-4 py-2">{r.description}</td>
                                <td className="pr-4 py-2">{(r.waveScore ?? 0).toFixed(3)}</td>
                                <td className="pr-4 py-2">{r.daysDiff}</td>
                                <td className="pr-4 py-2">{r.alignment}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Astronomical Chart Tab */}
          {activeTab === 'astro' && (
            <div className="astrology-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Astronomical Chart</h2>
              <AstroChart planetaryPositions={planetaryPositions} />
            </div>
          )}

          {/* Planetary Positions Tab */}
          {activeTab === 'planets' && (
            <PlanetaryVisualization 
              planetaryPositions={planetaryPositions}
              aspects={aspects}
              dasha={dasha}
              positivityScore={positivityScore}
              futureProjections={futureProjections}
              sinusoidalTrend={sinusoidalTrend}
            />
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="astrology-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Life Milestones Analysis</h2>
                <button
                  onClick={() => setShowAddMilestonesModal(true)}
                  className="form-button flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestones
                </button>
              </div>
              
              {(milestoneAnalysis || []).length > 0 ? (
                <div className="space-y-4">
                  {(milestoneAnalysis || []).map((milestone, index) => {
                    const level = getPositivityLevel(milestone.positivityScore);
                    return (
                      <div key={index} className="milestone-item">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="milestone-date">{milestone.date}</div>
                            <div className="milestone-description">{milestone.description}</div>
                            <div className="milestone-alignment">{milestone.alignment}</div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-lg font-bold ${level.color}`}>
                              {milestone.positivityScore.toFixed(3)}
                            </div>
                            <div className="text-sm text-gray-400">{level.level}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No milestones added yet</p>
                  <button
                    onClick={() => setShowAddMilestonesModal(true)}
                    className="form-button mt-4"
                  >
                    Add Your First Milestone
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Classical Insights Tab */}
          {activeTab === 'classics' && (
            <div className="astrology-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Classical Insights</h2>

              {/* Scores */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                  <p className="text-gray-300 text-sm">Base Positivity Score</p>
                  <p className={`text-2xl font-bold ${getPositivityLevel(positivityScore).color}`}>{positivityScore.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                  <p className="text-gray-300 text-sm">Adjusted (Classical) Score</p>
                  <p className={`text-2xl font-bold ${getPositivityLevel((adjustedPositivityScore ?? positivityScore)).color}`}>
                    {(adjustedPositivityScore ?? positivityScore).toFixed(3)}
                  </p>
                </div>
              </div>

              {/* Yogas */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Detected Yogas</h3>
                {(classicalInsights.yogas && classicalInsights.yogas.length > 0) ? (
                  <div className="space-y-3">
                    {classicalInsights.yogas.map((y, i) => (
                      <div key={i} className="p-3 bg-gray-700 bg-opacity-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{y.name}</p>
                            <p className="text-gray-400 text-sm">{y.impact}</p>
                            {y.source && <p className="text-gray-500 text-xs mt-1">Source: {y.source}</p>}
                          </div>
                          {typeof y.score === 'number' && (
                            <span className="text-green-400 font-semibold">+{y.score.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No classical yogas detected in this snapshot.</p>
                )}
              </div>

              {/* Per-planet dignity and house contribution */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Per-Planet Dignity & House</h3>
                {classicalInsights.perPlanet ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(classicalInsights.perPlanet).map(([planet, info]) => (
                      <div key={planet} className="p-3 bg-gray-700 bg-opacity-50 rounded-lg">
                        <p className="text-white font-medium mb-1">{planet}</p>
                        <p className="text-gray-300 text-sm">Sign: {info.sign} | House: {info.house} ({info.houseCategory})</p>
                        <p className="text-gray-300 text-sm">Dignity: {info.dignity} (d:{info.dignityScore?.toFixed?.(2) ?? info.dignityScore}, h:{info.houseScore?.toFixed?.(2) ?? info.houseScore})</p>
                        <p className="text-gray-400 text-sm">Contribution: {info.totalContribution?.toFixed?.(3) ?? info.totalContribution}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No per-planet classical data available.</p>
                )}
              </div>

              {/* Jaimini Karakas */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Jaimini Chara Karakas (Simplified)</h3>
                {classicalInsights.karakas ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(classicalInsights.karakas).map(([karaka, planet]) => (
                      <div key={karaka} className="p-3 bg-gray-700 bg-opacity-50 rounded-lg">
                        <p className="text-white font-medium">{karaka}</p>
                        <p className="text-gray-300 text-sm">{planet}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No karaka data available.</p>
                )}
              </div>

              {/* Empty-state hint */}
              {(!classicalInsights || Object.keys(classicalInsights).length === 0) && (
                <div className="mt-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-600 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    No classical insights present. Generate a new prediction to populate this tab.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Birth Star Timeline Modal */}
      {showTimeline && (
        <BirthStarTimeline
          birthDate={userInfo?.birthDate}
          birthPlace={userInfo?.birthPlace}
          latitude={userInfo?.latitude}
          longitude={userInfo?.longitude}
          onClose={() => setShowTimeline(false)}
        />
      )}

      {/* Add Milestones Modal */}
      {showAddMilestonesModal && (
        <AddMilestonesModal
          isOpen={showAddMilestonesModal}
          onClose={() => setShowAddMilestonesModal(false)}
          onMilestonesAdded={handleMilestonesAdded}
          currentMilestones={milestoneAnalysis}
        />
      )}
    </div>
  );
};

export default ResultsPage;
