import React, { useState } from 'react';
import axios from 'axios';

const TestForm = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing form submission...');
      
      const testData = {
        name: "Test User",
        birthDate: "1990-01-01",
        birthTime: "12:00",
        birthPlace: "Mumbai",
        latitude: 19.0760,
        longitude: 72.8777,
        milestones: []
      };

      console.log('Sending test data:', testData);
      
      const response = await axios.post('/api/astrology/prediction', testData);
      
      console.log('Test response:', response.data);
      setResult(response.data);
      
    } catch (error) {
      console.error('Test error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          🧪 Form Connection Test
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={testSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded">
              <h3 className="font-bold">Error:</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-500 text-white p-4 rounded">
              <h3 className="font-bold">Success!</h3>
              <p>Backend is working correctly.</p>
              <div className="mt-2 text-sm">
                <p><strong>Planets:</strong> {Object.keys(result.prediction.planetaryPositions).length}</p>
                <p><strong>Aspects:</strong> {result.prediction.aspects.length}</p>
                <p><strong>Dasha:</strong> {result.prediction.dasha}</p>
                <p><strong>Positivity Score:</strong> {result.prediction.positivityScore.toFixed(3)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/prediction" 
            className="text-blue-300 hover:text-blue-200 underline"
          >
            Go to Main Form
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestForm;
