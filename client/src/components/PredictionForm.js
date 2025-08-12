import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Plus, X, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import LocationSearch from './LocationSearch';

const PredictionForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState({ description: '', date: new Date() });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  // Watch form values for location validation
  const birthPlace = watch('birthPlace');

  // Add milestone
  const addMilestone = () => {
    if (!newMilestone.description.trim()) {
      toast.error('Please enter a milestone description');
      return;
    }

    const milestone = {
      id: Date.now(),
      description: newMilestone.description.trim(),
      date: newMilestone.date.toISOString().split('T')[0]
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({ description: '', date: new Date() });
    toast.success('Milestone added successfully');
  };

  // Remove milestone
  const removeMilestone = (id) => {
    setMilestones(milestones.filter(m => m.id !== id));
    toast.success('Milestone removed');
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('Form submitted!', data);
    setIsLoading(true);
    
    try {
      const formData = {
        ...data,
        milestones: milestones
      };

      console.log('Submitting form data:', formData);
      console.log('Form data validation:', {
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        latitude: formData.latitude,
        longitude: formData.longitude,
        milestonesCount: formData.milestones.length
      });
      
      console.log('Location coordinates being sent:', {
        latitude: formData.latitude,
        longitude: formData.longitude,
        birthPlace: formData.birthPlace
      });
      
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to generate predictions');
        return;
      }

      const response = await axios.post('/api/astrology/prediction', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      console.log('API Response structure:', {
        success: response.data.success,
        hasPrediction: !!response.data.prediction,
        predictionKeys: response.data.prediction ? Object.keys(response.data.prediction) : [],
        hasPlanetaryPositions: !!(response.data.prediction && response.data.prediction.planetaryPositions),
        planetaryPositionsCount: response.data.prediction && response.data.prediction.planetaryPositions ? Object.keys(response.data.prediction.planetaryPositions).length : 0
      });
      
      if (response.data.success) {
        // Store prediction data in sessionStorage for results page
        sessionStorage.setItem('predictionData', JSON.stringify(response.data));
        console.log('Data stored in sessionStorage');
        console.log('Stored data preview:', JSON.stringify(response.data).substring(0, 500) + '...');
        navigate('/results');
        toast.success('Your cosmic prediction is ready!');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.error || 'Failed to generate prediction');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Cosmic Journey Begins
          </h1>
          <p className="text-xl text-gray-300">
            Enter your birth details and life milestones to discover your astrological alignment
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="astrology-card"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Birth Details Section */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-purple-400" />
                Birth Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-gray-300 mb-2">Birth Date</label>
                  <input
                    type="date"
                    {...register('birthDate', { required: 'Birth date is required' })}
                    className="form-input"
                  />
                  {errors.birthDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.birthDate.message}</p>
                  )}
                </div>

                {/* Birth Time */}
                <div>
                  <label className="block text-gray-300 mb-2">Birth Time</label>
                  <input
                    type="time"
                    {...register('birthTime', { required: 'Birth time is required' })}
                    className="form-input"
                  />
                  {errors.birthTime && (
                    <p className="text-red-400 text-sm mt-1">{errors.birthTime.message}</p>
                  )}
                </div>

                {/* Birth Place */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Birth Place</label>
                  <LocationSearch 
                    onLocationSelect={(location) => {
                      setValue('birthPlace', location.name);
                      setValue('latitude', location.lat);
                      setValue('longitude', location.lng);
                      toast.success(`Location set: ${location.name}`);
                    }}
                    currentLocation={watch('birthPlace') ? {
                      name: watch('birthPlace'),
                      lat: watch('latitude'),
                      lng: watch('longitude')
                    } : null}
                  />
                  {errors.birthPlace && (
                    <p className="text-red-400 text-sm mt-1">{errors.birthPlace.message}</p>
                  )}
                  
                  {/* Hidden coordinates fields for form validation */}
                  <input
                    type="hidden"
                    {...register('latitude', { 
                      required: 'Latitude is required',
                      min: { value: -90, message: 'Latitude must be between -90 and 90' },
                      max: { value: 90, message: 'Latitude must be between -90 and 90' }
                    })}
                  />
                  <input
                    type="hidden"
                    {...register('longitude', { 
                      required: 'Longitude is required',
                      min: { value: -180, message: 'Longitude must be between -180 and 180' },
                      max: { value: 180, message: 'Longitude must be between -180 and 180' }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Milestones Section */}
            <div>
              <button
                type="button"
                onClick={() => setShowMilestones(!showMilestones)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-purple-400" />
                  Add Significant Milestones
                </h2>
                {showMilestones ? (
                  <ChevronUp className="w-6 h-6 text-purple-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-purple-400" />
                )}
              </button>

              {showMilestones && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <p className="text-gray-300">
                    Add important life events to see how they align with your cosmic energy cycles.
                  </p>

                  {/* Add New Milestone */}
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-gray-300 mb-2">Event Description</label>
                        <input
                          type="text"
                          value={newMilestone.description}
                          onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                          className="form-input"
                          placeholder="e.g., Got my first job, Met my spouse"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Event Date</label>
                        <DatePicker
                          selected={newMilestone.date}
                          onChange={(date) => setNewMilestone({...newMilestone, date})}
                          className="form-input"
                          dateFormat="yyyy-MM-dd"
                          maxDate={new Date()}
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="form-button flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Milestone
                      </button>
                    </div>
                  </div>

                  {/* Milestones List */}
                  {milestones.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Your Milestones ({milestones.length})
                      </h3>
                      <div className="space-y-3">
                        {milestones.map((milestone) => (
                          <div key={milestone.id} className="milestone-item flex items-center justify-between">
                            <div>
                              <div className="milestone-date">{milestone.date}</div>
                              <div className="milestone-description">{milestone.description}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMilestone(milestone.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="form-button text-lg px-12 py-4 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner mr-3"></div>
                    Generating Your Cosmic Prediction...
                  </>
                ) : (
                  'Discover My Cosmic Journey'
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400">
            Your data is processed securely and used only for astrological calculations.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionForm;
