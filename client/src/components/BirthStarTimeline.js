import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Scatter, ReferenceLine, Area, AreaChart
} from 'recharts';
import { 
  Calendar, Clock, Star, TrendingUp, TrendingDown, 
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw,
  Sun, Moon, Zap, Heart, Target, Award
} from 'lucide-react';
import moment from 'moment';

const BirthStarTimeline = ({ birthDate, birthPlace, latitude, longitude, onClose }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per period
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [viewMode, setViewMode] = useState('positivity'); // 'positivity', 'planets', 'aspects'
  const timelineRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Calculate total periods from birth to now (6-month intervals)
  const birthMoment = moment(birthDate);
  const now = moment();
  const totalMonths = now.diff(birthMoment, 'months');
  const totalPeriods = Math.ceil(totalMonths / 6);

  useEffect(() => {
    generateTimelineData();
  }, [birthDate, latitude, longitude]);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentPeriod(prev => {
          if (prev >= totalPeriods - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, totalPeriods]);

  const generateTimelineData = async () => {
    setIsLoading(true);
    
    try {
      // Generate data for each 6-month period from birth to now
      const data = [];
      
      // Use default coordinates if not provided
      const defaultLat = latitude || 0;
      const defaultLng = longitude || 0;
      
      for (let period = 0; period < totalPeriods; period++) {
        const periodStart = moment(birthDate).add(period * 6, 'months');
        const periodEnd = moment(periodStart).add(6, 'months');
        const periodMid = moment(periodStart).add(3, 'months');
        
        // Calculate average positivity for the period
        const positivityScores = [];
        for (let day = 0; day < 180; day += 30) { // Sample every 30 days
          const sampleDate = moment(periodStart).add(day, 'days');
          const score = calculatePositivityScore(sampleDate);
          positivityScores.push(score);
        }
        
        const avgPositivity = positivityScores.reduce((sum, score) => sum + score, 0) / positivityScores.length;
        const maxPositivity = Math.max(...positivityScores);
        const minPositivity = Math.min(...positivityScores);
        
        // Generate planetary positions for the period
        const planetaryPositions = generatePlanetaryPositions(periodMid);
        
        // Generate aspects for the period
        const aspects = generateAspects(planetaryPositions);
        
        // Calculate dasha period
        const dasha = calculateDasha(periodMid);
        
        // Determine cosmic phase
        const cosmicPhase = getCosmicPhase(avgPositivity);
        
        // Calculate life stage
        const ageInYears = periodMid.diff(birthMoment, 'years', true);
        const lifeStage = getLifeStage(ageInYears);
        
        data.push({
          period,
          startDate: periodStart.format('YYYY-MM-DD'),
          endDate: periodEnd.format('YYYY-MM-DD'),
          midDate: periodMid.format('YYYY-MM-DD'),
          ageInYears: Math.floor(ageInYears),
          avgPositivity,
          maxPositivity,
          minPositivity,
          planetaryPositions,
          aspects,
          dasha,
          cosmicPhase,
          lifeStage,
          positivityScores,
          periodLabel: `${periodStart.format('MMM YYYY')} - ${periodEnd.format('MMM YYYY')}`,
          yearLabel: periodStart.format('YYYY')
        });
      }
      
      setTimelineData(data);
    } catch (error) {
      console.error('Error generating timeline data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified positivity calculation (you can replace with actual API call)
  const calculatePositivityScore = (date) => {
    const baseScore = 0.1;
    const seasonalFactor = Math.sin((date.month() * Math.PI) / 6) * 0.3;
    const cyclicalFactor = Math.sin((date.dayOfYear() * Math.PI) / 365) * 0.2;
    const randomFactor = (Math.random() - 0.5) * 0.1;
    
    return Math.max(-1, Math.min(1, baseScore + seasonalFactor + cyclicalFactor + randomFactor));
  };

  // Simplified planetary positions generation
  const generatePlanetaryPositions = (date) => {
    const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
    const positions = {};
    
    planets.forEach(planet => {
      const baseLongitude = (date.dayOfYear() * 360 / 365) % 360;
      const planetOffset = planets.indexOf(planet) * 51.4; // Distribute planets
      const longitude = (baseLongitude + planetOffset) % 360;
      const house = Math.floor(longitude / 30) + 1;
      
      positions[planet] = {
        longitude,
        house,
        latitude: (Math.random() - 0.5) * 10,
        distance: 1 + Math.random() * 0.5
      };
    });
    
    return positions;
  };

  // Simplified aspects generation
  const generateAspects = (planetaryPositions) => {
    const aspects = [];
    const planets = Object.keys(planetaryPositions);
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        const pos1 = planetaryPositions[planet1].longitude;
        const pos2 = planetaryPositions[planet2].longitude;
        
        const angle = Math.abs(pos1 - pos2);
        const aspect = getAspectType(angle);
        
        if (aspect) {
          aspects.push({
            planet1,
            planet2,
            angle,
            type: aspect.type,
            influence: aspect.influence
          });
        }
      }
    }
    
    return aspects;
  };

  const getAspectType = (angle) => {
    const tolerance = 8;
    
    if (Math.abs(angle - 0) <= tolerance) return { type: 'conjunction', influence: -0.3 };
    if (Math.abs(angle - 60) <= tolerance) return { type: 'sextile', influence: 0.4 };
    if (Math.abs(angle - 90) <= tolerance) return { type: 'square', influence: -0.5 };
    if (Math.abs(angle - 120) <= tolerance) return { type: 'trine', influence: 0.6 };
    if (Math.abs(angle - 180) <= tolerance) return { type: 'opposition', influence: -0.4 };
    
    return null;
  };

  const calculateDasha = (date) => {
    const dashas = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
    const dashaIndex = Math.floor(date.diff(birthMoment, 'years') / 6) % dashas.length;
    return dashas[dashaIndex];
  };

  const getCosmicPhase = (score) => {
    if (score >= 0.7) return 'Excellence';
    if (score >= 0.4) return 'Growth';
    if (score >= 0.1) return 'Balance';
    if (score >= -0.2) return 'Challenge';
    return 'Transformation';
  };

  const getLifeStage = (age) => {
    if (age < 7) return 'Early Childhood';
    if (age < 14) return 'Childhood';
    if (age < 21) return 'Adolescence';
    if (age < 35) return 'Young Adulthood';
    if (age < 50) return 'Middle Adulthood';
    if (age < 65) return 'Mature Adulthood';
    return 'Wisdom Years';
  };

  const getPositivityColor = (score) => {
    if (score >= 0.6) return '#10B981'; // Green
    if (score >= 0.3) return '#3B82F6'; // Blue
    if (score >= 0) return '#F59E0B'; // Yellow
    if (score >= -0.3) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getPositivityIcon = (score) => {
    if (score >= 0.6) return <Award className="w-4 h-4" />;
    if (score >= 0.3) return <TrendingUp className="w-4 h-4" />;
    if (score >= 0) return <Target className="w-4 h-4" />;
    if (score >= -0.3) return <Heart className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentPeriod(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  const scrollToPeriod = (period) => {
    setCurrentPeriod(period);
    if (timelineRef.current) {
      const element = timelineRef.current.querySelector(`[data-period="${period}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const currentData = timelineData[currentPeriod] || null;
  const visibleData = timelineData.slice(Math.max(0, currentPeriod - 2), currentPeriod + 3);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-white">Generating your cosmic timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">🌟 Birth Star Alignment Timeline</h1>
              <p className="text-gray-300">
                {birthPlace} • Born {moment(birthDate).format('MMMM Do, YYYY')} • {totalPeriods} periods of your cosmic journey
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white transition-colors`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
                >
                  <option value={2000}>Slow</option>
                  <option value={1000}>Normal</option>
                  <option value={500}>Fast</option>
                  <option value={200}>Very Fast</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">View:</span>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
                >
                  <option value="positivity">Positivity</option>
                  <option value="planets">Planets</option>
                  <option value="aspects">Aspects</option>
                </select>
              </div>
              
              <div className="text-gray-300">
                Period {currentPeriod + 1} of {totalPeriods}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Navigation */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPeriod(Math.max(0, currentPeriod - 1))}
              disabled={currentPeriod === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex-1 mx-4">
              <input
                type="range"
                min="0"
                max={totalPeriods - 1}
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <button
              onClick={() => setCurrentPeriod(Math.min(totalPeriods - 1, currentPeriod + 1))}
              disabled={currentPeriod === totalPeriods - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg text-white transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Timeline Chart */}
          <div className="flex-1 p-6 overflow-y-auto" ref={timelineRef}>
            <div className="space-y-6">
              {/* Current Period Focus */}
              {currentData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {currentData.periodLabel} • Age {currentData.ageInYears}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {getPositivityIcon(currentData.avgPositivity)}
                      <span className="text-white font-semibold">
                        {currentData.cosmicPhase}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                      <h3 className="text-blue-400 font-semibold mb-2">Positivity Score</h3>
                      <p className="text-2xl font-bold text-white">
                        {currentData.avgPositivity.toFixed(3)}
                      </p>
                      <p className="text-sm text-gray-300">
                        Range: {currentData.minPositivity.toFixed(3)} - {currentData.maxPositivity.toFixed(3)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                      <h3 className="text-green-400 font-semibold mb-2">Dasha Period</h3>
                      <p className="text-2xl font-bold text-white">{currentData.dasha}</p>
                      <p className="text-sm text-gray-300">{currentData.lifeStage}</p>
                    </div>
                    
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                      <h3 className="text-yellow-400 font-semibold mb-2">Planetary Aspects</h3>
                      <p className="text-2xl font-bold text-white">{currentData.aspects.length}</p>
                      <p className="text-sm text-gray-300">Active influences</p>
                    </div>
                  </div>
                  
                  {/* Positivity Chart */}
                  <div className="bg-gray-800 bg-opacity-30 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-4">6-Month Positivity Journey</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={currentData.positivityScores.map((score, index) => ({
                        month: index + 1,
                        score,
                        date: moment(currentData.startDate).add(index * 30, 'days').format('MMM')
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
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
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#8B5CF6" 
                          fill="#8B5CF6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Timeline Overview */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Cosmic Journey</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="yearLabel" 
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
                      dataKey="avgPositivity" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                    />
                    <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
                    <ReferenceLine y={0.5} stroke="#10B981" strokeDasharray="3 3" />
                    <ReferenceLine y={-0.5} stroke="#EF4444" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Period Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleData.map((period, index) => (
                  <motion.div
                    key={period.period}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    data-period={period.period}
                    onClick={() => handlePeriodClick(period.period)}
                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700 ${
                      period.period === currentPeriod ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{period.periodLabel}</h4>
                      <div className="flex items-center space-x-1">
                        {getPositivityIcon(period.avgPositivity)}
                        <span className="text-sm text-gray-300">Age {period.ageInYears}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Positivity:</span>
                        <span 
                          className="font-semibold"
                          style={{ color: getPositivityColor(period.avgPositivity) }}
                        >
                          {period.avgPositivity.toFixed(3)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Dasha:</span>
                        <span className="text-white font-semibold">{period.dasha}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Phase:</span>
                        <span className="text-purple-400 font-semibold">{period.cosmicPhase}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Period Details */}
          {selectedPeriod !== null && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Period Details</h3>
                <button
                  onClick={() => setSelectedPeriod(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {timelineData[selectedPeriod] && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Planetary Positions</h4>
                    <div className="space-y-2">
                      {Object.entries(timelineData[selectedPeriod].planetaryPositions).map(([planet, data]) => (
                        <div key={planet} className="flex justify-between items-center">
                          <span className="text-gray-300">{planet}:</span>
                          <span className="text-white">House {data.house} ({data.longitude.toFixed(1)}°)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Active Aspects</h4>
                    <div className="space-y-2">
                      {timelineData[selectedPeriod].aspects.slice(0, 5).map((aspect, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{aspect.planet1}-{aspect.planet2}:</span>
                          <span className={`font-semibold ${
                            aspect.influence > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {aspect.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Life Context</h4>
                    <p className="text-gray-300 text-sm">
                      This was a period of {timelineData[selectedPeriod].lifeStage.toLowerCase()}, 
                      marked by {timelineData[selectedPeriod].cosmicPhase.toLowerCase()} in your cosmic journey.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BirthStarTimeline;
