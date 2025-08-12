import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DebugData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('predictionData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white font-semibold mb-4">No Data Found</h2>
          <p className="text-gray-300">Please submit the form first to see the data.</p>
          <a 
            href="/prediction" 
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Form
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">🔍 Debug Data View</h1>
          <p className="text-gray-300">Raw data received from the API</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Raw JSON */}
          <div className="astrology-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Raw JSON Data</h2>
            <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-sm text-green-400 max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          {/* Parsed Data */}
          <div className="astrology-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Parsed Data Summary</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Success Status</h3>
                <p className="text-green-400">{data.success ? '✅ True' : '❌ False'}</p>
              </div>

              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">User ID</h3>
                <p className="text-blue-400">{data.userId}</p>
              </div>

              {data.prediction && (
                <>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Planetary Positions</h3>
                    <p className="text-yellow-400">
                      {Object.keys(data.prediction.planetaryPositions || {}).length} planets
                    </p>
                    <div className="text-sm text-gray-300 mt-2">
                      {Object.keys(data.prediction.planetaryPositions || {}).join(', ')}
                    </div>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Aspects</h3>
                    <p className="text-purple-400">
                      {(data.prediction.aspects || []).length} aspects
                    </p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Dasha</h3>
                    <p className="text-orange-400">{data.prediction.dasha}</p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Positivity Score</h3>
                    <p className="text-green-400">
                      {(data.prediction.positivityScore || 0).toFixed(3)}
                    </p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Sinusoid Data</h3>
                    <p className="text-blue-400">
                      {(data.prediction.sinusoidData || []).length} data points
                    </p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Milestone Analysis</h3>
                    <p className="text-pink-400">
                      {(data.prediction.milestoneAnalysis || []).length} milestones
                    </p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Prediction Text</h3>
                    <p className="text-gray-300 italic">
                      {data.prediction.prediction || 'No prediction text'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <a 
            href="/results" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            View Results Page
          </a>
          <a 
            href="/prediction" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            Submit New Data
          </a>
        </div>
      </div>
    </div>
  );
};

export default DebugData;
