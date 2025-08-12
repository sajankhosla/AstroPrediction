import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const PlanetaryVisualization = ({ planetaryPositions, aspects, dasha, positivityScore, futureProjections = [], sinusoidalTrend = null }) => {
  // Planet colors for visualization
  const planetColors = {
    'SUN': '#FFD700',
    'MOON': '#C0C0C0',
    'MARS': '#FF4500',
    'MERCURY': '#32CD32',
    'JUPITER': '#FF8C00',
    'VENUS': '#FF69B4',
    'SATURN': '#708090',
    'RAHU': '#800080',
    'KETU': '#4B0082'
  };

  // House positions data for pie chart
  const houseData = Object.entries(planetaryPositions).map(([planet, data]) => ({
    name: planet,
    value: data.house,
    color: planetColors[planet] || '#8884d8',
    longitude: data.longitude,
    house: data.house
  }));

  // Use backend future projections or generate fallback
  const getFutureProjections = () => {
    if (futureProjections && futureProjections.length > 0) {
      return futureProjections;
    }
    
    // Fallback generation if backend data not available
    const projections = [];
    const currentDate = new Date();
    
    for (let i = 1; i <= 24; i++) {
      const futureDate = new Date(currentDate);
      futureDate.setMonth(currentDate.getMonth() + i);
      
      const baseScore = positivityScore;
      const monthlyVariation = Math.sin(i * 0.3) * 0.2;
      const dashaInfluence = getDashaInfluence(dasha, i);
      const futureScore = Math.max(-1, Math.min(1, baseScore + monthlyVariation + dashaInfluence));
      
      projections.push({
        month: futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        positivityScore: futureScore,
        date: futureDate.toISOString().split('T')[0]
      });
    }
    
    return projections;
  };

  const getDashaInfluence = (currentDasha, monthsAhead) => {
    const dashaInfluences = {
      'SUN': 0.1,
      'MOON': 0.15,
      'MARS': 0.2,
      'MERCURY': 0.1,
      'JUPITER': 0.25,
      'VENUS': 0.2,
      'SATURN': -0.1,
      'RAHU': 0.05,
      'KETU': -0.05
    };
    
    const influence = dashaInfluences[currentDasha] || 0;
    return influence * Math.cos(monthsAhead * 0.2);
  };

  // Aspect strength data for bar chart
  const aspectData = aspects.map(aspect => ({
    aspect: `${aspect.planet1}-${aspect.planet2}`,
    strength: Math.abs(aspect.influence),
    type: aspect.type,
    influence: aspect.influence
  }));

  const projectionsData = getFutureProjections();

  // Custom tooltip for planetary positions
  const CustomPlanetaryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-yellow-400">House: {data.house}</p>
          <p className="text-blue-400">Longitude: {data.longitude.toFixed(1)}°</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Planetary Positions Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="astrology-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">🌟 Planetary Positions</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* House Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">House Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={houseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, house }) => `${name} (H${house})`}
                >
                  {houseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPlanetaryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Planetary List */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Current Positions</h3>
            <div className="space-y-3">
              {Object.entries(planetaryPositions).map(([planet, data]) => (
                <div key={planet} className="flex items-center justify-between bg-gray-700 bg-opacity-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: planetColors[planet] || '#8884d8' }}
                    ></div>
                    <span className="text-white font-semibold">{planet}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400">House {data.house}</div>
                    <div className="text-gray-300 text-sm">{data.longitude.toFixed(1)}°</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Planetary Aspects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="astrology-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">🔗 Planetary Aspects</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Aspect Strength Chart */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Aspect Strengths</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aspectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="aspect" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="strength" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Aspect Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Aspect Details</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {aspects.map((aspect, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    aspect.influence > 0 
                      ? 'bg-green-900 bg-opacity-30 border-green-500' 
                      : 'bg-red-900 bg-opacity-30 border-red-500'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">
                      {aspect.planet1} {aspect.type} {aspect.planet2}
                    </span>
                    <span className={`text-sm ${
                      aspect.influence > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {aspect.influence > 0 ? 'Harmonious' : 'Challenging'}
                    </span>
                  </div>
                  <div className="text-gray-300 text-sm">
                    Angle: {aspect.angle.toFixed(1)}° | Influence: {aspect.influence.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Future Projections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="astrology-card"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">🔮 Future Projections</h2>
        
        <div className="space-y-6">
          {/* Projection Chart */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">2-Year Positivity Forecast</h3>
            <ResponsiveContainer width="100%" height={400}>
                              <LineChart data={projectionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="month" 
                  stroke="#fff" 
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#fff" 
                  domain={[-1, 1]}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                  formatter={(value) => [`Score: ${value.toFixed(3)}`, 'Positivity']}
                />
                <Line 
                  type="monotone" 
                  dataKey="positivityScore" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sinusoidal Trend Analysis */}
          {sinusoidalTrend && (
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">🔬 Algorithmic Sinusoidal Trend Analysis</h3>
              
              {/* Trend Statistics */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Model Fit (R²)</h4>
                  <p className="text-2xl font-bold text-white">
                    {(sinusoidalTrend.rSquared * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-300">
                    {sinusoidalTrend.rSquared > 0.8 ? 'Excellent fit' :
                     sinusoidalTrend.rSquared > 0.6 ? 'Good fit' :
                     sinusoidalTrend.rSquared > 0.4 ? 'Moderate fit' : 'Basic fit'}
                  </p>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Trend Strength</h4>
                  <p className="text-2xl font-bold text-white">
                    {sinusoidalTrend.trendStrength.toFixed(3)}
                  </p>
                  <p className="text-sm text-gray-300">
                    {sinusoidalTrend.trendStrength > 0.3 ? 'Strong pattern' :
                     sinusoidalTrend.trendStrength > 0.2 ? 'Moderate pattern' : 'Subtle pattern'}
                  </p>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Cycles Detected</h4>
                  <p className="text-2xl font-bold text-white">
                    {sinusoidalTrend.frequencies.length}
                  </p>
                  <p className="text-sm text-gray-300">
                    Astrological cycles
                  </p>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Projection Confidence</h4>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(sinusoidalTrend.projected[0]?.confidence * 100)}%
                  </p>
                  <p className="text-sm text-gray-300">
                    Next month accuracy
                  </p>
                </div>
              </div>

              {/* Trend Visualization */}
              <div className="bg-gray-800 bg-opacity-30 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-4">📈 Mathematical Trend Projection</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={sinusoidalTrend.projected.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[-1, 1]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-300 mt-2">
                  Algorithmic projection based on {sinusoidalTrend.historical.length} historical data points
                </p>
              </div>

              {/* Mathematical Insights */}
              <div className="space-y-4 text-gray-200">
                <h4 className="text-white font-semibold">🧮 Mathematical Insights</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <strong>Primary Cycle:</strong> {Math.round(365 / (2 * Math.PI / sinusoidalTrend.frequencies[0]))} days
                    </p>
                    <p className="text-sm">
                      <strong>Secondary Cycle:</strong> {Math.round(365 / (2 * Math.PI / sinusoidalTrend.frequencies[1]))} days
                    </p>
                    <p className="text-sm">
                      <strong>Base Level:</strong> {sinusoidalTrend.parameters[0].toFixed(3)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Peak Projection:</strong> {Math.max(...sinusoidalTrend.projected.map(p => p.y)).toFixed(3)}
                    </p>
                    <p className="text-sm">
                      <strong>Low Projection:</strong> {Math.min(...sinusoidalTrend.projected.map(p => p.y)).toFixed(3)}
                    </p>
                    <p className="text-sm">
                      <strong>Trend Direction:</strong> {
                        sinusoidalTrend.projected[sinusoidalTrend.projected.length - 1].y > sinusoidalTrend.projected[0].y 
                          ? '↗️ Rising' : '↘️ Declining'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Periods */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Key Periods Ahead</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { period: 'Next 6 Months', data: projectionsData.slice(0, 6) },
                { period: '6-12 Months', data: projectionsData.slice(6, 12) },
                { period: '1-2 Years', data: projectionsData.slice(12, 24) }
              ].map(({ period, data }) => {
                const avgScore = data.reduce((sum, item) => sum + item.positivityScore, 0) / data.length;
                const bestMonth = data.reduce((best, current) => 
                  current.positivityScore > best.positivityScore ? current : best
                );
                const worstMonth = data.reduce((worst, current) => 
                  current.positivityScore < worst.positivityScore ? current : worst
                );

                return (
                  <div key={period} className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">{period}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Average Score:</span>
                        <span className={`font-semibold ${
                          avgScore > 0.3 ? 'text-green-400' : 
                          avgScore > 0 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {avgScore.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Peak Month:</span>
                        <span className="text-green-400 font-semibold">
                          {bestMonth.month}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Challenging:</span>
                        <span className="text-red-400 font-semibold">
                          {worstMonth.month}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cosmic Guidance */}
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">🌟 Cosmic Guidance</h3>
            <div className="space-y-4 text-gray-200">
              <p>
                <strong>Current Dasha ({dasha}):</strong> You are currently in a {dasha} dasha period, 
                which brings {dasha === 'JUPITER' ? 'wisdom and expansion' : 
                dasha === 'VENUS' ? 'love and creativity' :
                dasha === 'MARS' ? 'energy and courage' :
                dasha === 'MERCURY' ? 'communication and learning' :
                dasha === 'SATURN' ? 'discipline and challenges' :
                dasha === 'SUN' ? 'leadership and vitality' :
                dasha === 'MOON' ? 'emotions and intuition' :
                'unique cosmic energies'} to your life.
              </p>
              <p>
                <strong>Next 6 Months:</strong> Focus on {positivityScore > 0.3 ? 'expanding your horizons' :
                positivityScore > 0 ? 'maintaining balance' : 'inner growth and patience'}. 
                This period is favorable for {positivityScore > 0.3 ? 'new beginnings and opportunities' :
                positivityScore > 0 ? 'steady progress' : 'reflection and preparation'}.
              </p>
              <p>
                <strong>Long-term Outlook:</strong> The cosmic energies suggest a period of 
                {projectionsData.slice(12, 24).reduce((sum, item) => sum + item.positivityScore, 0) / 12 > 0.3 
                  ? ' significant growth and achievement' : 
                  projectionsData.slice(12, 24).reduce((sum, item) => sum + item.positivityScore, 0) / 12 > 0
                    ? ' steady development and learning' : 
                    ' transformation and inner work'} in the coming years.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanetaryVisualization;
