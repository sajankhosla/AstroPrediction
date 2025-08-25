import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  // Check if user is logged in and redirect to dashboard
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: "Vedic Astrology Engine",
      description: "Advanced calculations based on ancient Vedic principles and planetary movements."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      title: "Positivity Sinusoid",
      description: "Visualize your life's positive events aligned with cosmic energy cycles."
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Real-time Predictions",
      description: "Get instant predictions based on current planetary transits and dasha periods."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Personal Milestones",
      description: "Track your life events and see how they align with astrological cycles."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Vedic Astrology</span>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/auth')}
              className="form-button"
            >
              Get Started
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Discover Your
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Cosmic Destiny
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the ancient wisdom of Vedic astrology combined with modern technology. 
              Visualize your life's journey through the lens of cosmic energy cycles.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate('/auth')}
                className="form-button text-lg px-8 py-4 flex items-center space-x-2"
              >
                <span>Begin Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => navigate('/demo')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 flex items-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span>Try Demo</span>
              </button>
              
              <button className="px-8 py-4 border-2 border-purple-500 text-purple-300 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-200">
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our advanced Vedic astrology engine provides comprehensive insights into your cosmic journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="astrology-card text-center hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-800 bg-opacity-30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Three simple steps to unlock your cosmic insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Enter Your Details",
                description: "Provide your birth date, time, and location for accurate calculations."
              },
              {
                step: "02",
                title: "Add Life Milestones",
                description: "Record significant events in your life to see their cosmic alignment."
              },
              {
                step: "03",
                title: "Discover Insights",
                description: "View your personalized positivity sinusoid and astrological predictions."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Explore Your Cosmic Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who have discovered the alignment between their life events and cosmic energies.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="form-button text-lg px-10 py-4 text-xl"
            >
              Start Your Astrological Journey
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Vedic Astrology Prediction Engine. Ancient wisdom meets modern technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
