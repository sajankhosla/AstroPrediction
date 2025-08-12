import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Clock, Info } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddMilestonesModal = ({ isOpen, onClose, onMilestonesAdded, currentMilestones = [] }) => {
  const [newMilestone, setNewMilestone] = useState({ description: '', date: new Date() });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Add to current milestones
    const updatedMilestones = [...currentMilestones, milestone];
    
    // Update prediction with new milestones
    updatePredictionWithMilestones(updatedMilestones);
    
    setNewMilestone({ description: '', date: new Date() });
    toast.success('Milestone added successfully');
  };

  const updatePredictionWithMilestones = async (milestones) => {
    setIsSubmitting(true);
    try {
      // Get the current prediction data
      const predictionData = JSON.parse(sessionStorage.getItem('predictionData'));
      const userInfo = predictionData.prediction.userInfo;

      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to update predictions');
        return;
      }

      // Call the update-milestones endpoint
      const response = await axios.post('/api/astrology/update-milestones', {
        milestones: milestones,
        userInfo: userInfo
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Update sessionStorage with new prediction data
        sessionStorage.setItem('predictionData', JSON.stringify(response.data));
        
        // Notify parent component
        onMilestonesAdded(response.data);
        
        toast.success('Prediction updated with new milestones!');
        onClose();
      }
    } catch (error) {
      console.error('Error updating milestones:', error);
      toast.error('Failed to update prediction with new milestones');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMilestone = (id) => {
    const updatedMilestones = currentMilestones.filter(m => m.id !== id);
    updatePredictionWithMilestones(updatedMilestones);
    toast.success('Milestone removed');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="astrology-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-purple-400" />
              Add Life Milestones
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Current Milestones */}
          {currentMilestones.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Current Milestones</h3>
              <div className="space-y-3">
                {currentMilestones.map((milestone) => (
                  <div key={milestone.id} className="bg-gray-700 bg-opacity-50 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{milestone.description}</div>
                      <div className="text-gray-400 text-sm">{milestone.date}</div>
                    </div>
                    <button
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Milestone */}
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Add New Milestone</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Event Description</label>
                <input
                  type="text"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                  className="form-input w-full"
                  placeholder="e.g., Got my first job, Met my spouse, Graduated college"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Event Date</label>
                <DatePicker
                  selected={newMilestone.date}
                  onChange={(date) => setNewMilestone({...newMilestone, date})}
                  className="form-input w-full"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  placeholderText="Select date"
                />
              </div>
              
              <button
                onClick={addMilestone}
                disabled={isSubmitting}
                className="form-button w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="loading-spinner-small mr-2"></div>
                ) : (
                  <Plus className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? 'Adding Milestone...' : 'Add Milestone'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              How Milestones Affect Your Prediction
            </h3>
            <p className="text-gray-300 text-sm">
              Adding significant life events helps us analyze how your cosmic energy aligned with these moments. 
              Your prediction will be updated to show the cosmic influence during these important times.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddMilestonesModal;
