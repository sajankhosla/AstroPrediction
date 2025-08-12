import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Globe, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationSearch = ({ onLocationSelect, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  // Popular cities for quick access
  const popularCities = [
    { name: 'New York, NY, USA', lat: 40.7128, lng: -74.0060, country: 'USA' },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'UK' },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'Japan' },
    { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, country: 'India' },
    { name: 'Sydney, NSW, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia' },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'France' },
    { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'Germany' },
    { name: 'Toronto, ON, Canada', lat: 43.6532, lng: -79.3832, country: 'Canada' },
    { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
    { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, country: 'South Africa' }
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentLocations');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Click outside to close results
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enhanced geocoding with multiple fallback services
  const searchLocation = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      // Try OpenCage Geocoding API first (most reliable)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=YOUR_OPENCAGE_API_KEY&limit=10&no_annotations=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedResults = data.results.map(result => ({
          name: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          country: result.components.country,
          state: result.components.state,
          city: result.components.city || result.components.town,
          type: 'geocoded'
        }));
        setResults(formattedResults);
      } else {
        // Fallback to a simpler geocoding service
        await fallbackGeocoding(searchQuery);
      }
    } catch (error) {
      console.log('Primary geocoding failed, using fallback...');
      await fallbackGeocoding(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  // Fallback geocoding using a free service
  const fallbackGeocoding = async (searchQuery) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedResults = data.map(result => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          country: result.address?.country,
          state: result.address?.state,
          city: result.address?.city || result.address?.town,
          type: 'fallback'
        }));
        setResults(formattedResults);
      }
    } catch (error) {
      console.error('Fallback geocoding failed:', error);
      // Use local city database as final fallback
      searchLocalCityDatabase(searchQuery);
    }
  };

  // Local city database for common cities
  const searchLocalCityDatabase = (searchQuery) => {
    const localCities = {
      'new york': { name: 'New York, NY, USA', lat: 40.7128, lng: -74.0060, country: 'USA' },
      'london': { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'UK' },
      'tokyo': { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'Japan' },
      'mumbai': { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, country: 'India' },
      'delhi': { name: 'Delhi, India', lat: 28.7041, lng: 77.1025, country: 'India' },
      'bangalore': { name: 'Bangalore, Karnataka, India', lat: 12.9716, lng: 77.5946, country: 'India' },
      'chennai': { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707, country: 'India' },
      'kolkata': { name: 'Kolkata, West Bengal, India', lat: 22.5726, lng: 88.3639, country: 'India' },
      'hyderabad': { name: 'Hyderabad, Telangana, India', lat: 17.3850, lng: 78.4867, country: 'India' },
      'pune': { name: 'Pune, Maharashtra, India', lat: 18.5204, lng: 73.8567, country: 'India' },
      'sydney': { name: 'Sydney, NSW, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia' },
      'melbourne': { name: 'Melbourne, VIC, Australia', lat: -37.8136, lng: 144.9631, country: 'Australia' },
      'paris': { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'France' },
      'berlin': { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'Germany' },
      'munich': { name: 'Munich, Germany', lat: 48.1351, lng: 11.5820, country: 'Germany' },
      'toronto': { name: 'Toronto, ON, Canada', lat: 43.6532, lng: -79.3832, country: 'Canada' },
      'vancouver': { name: 'Vancouver, BC, Canada', lat: 49.2827, lng: -123.1207, country: 'Canada' },
      'montreal': { name: 'Montreal, QC, Canada', lat: 45.5017, lng: -73.5673, country: 'Canada' },
      'sao paulo': { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
      'rio de janeiro': { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729, country: 'Brazil' },
      'cape town': { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, country: 'South Africa' },
      'johannesburg': { name: 'Johannesburg, South Africa', lat: -26.2041, lng: 28.0473, country: 'South Africa' },
      'dubai': { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, country: 'UAE' },
      'singapore': { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
      'hong kong': { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'Hong Kong' },
      'seoul': { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780, country: 'South Korea' },
      'beijing': { name: 'Beijing, China', lat: 39.9042, lng: 116.4074, country: 'China' },
      'shanghai': { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737, country: 'China' },
      'moscow': { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6176, country: 'Russia' },
      'istanbul': { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, country: 'Turkey' },
      'cairo': { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
      'nairobi': { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, country: 'Kenya' },
      'lagos': { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
      'mexico city': { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332, country: 'Mexico' },
      'buenos aires': { name: 'Buenos Aires, Argentina', lat: -34.6118, lng: -58.3960, country: 'Argentina' },
      'santiago': { name: 'Santiago, Chile', lat: -33.4489, lng: -70.6693, country: 'Chile' },
      'lima': { name: 'Lima, Peru', lat: -12.0464, lng: -77.0428, country: 'Peru' },
      'bogota': { name: 'Bogotá, Colombia', lat: 4.7110, lng: -74.0721, country: 'Colombia' },
      'caracas': { name: 'Caracas, Venezuela', lat: 10.4806, lng: -66.9036, country: 'Venezuela' },
      'havana': { name: 'Havana, Cuba', lat: 23.1136, lng: -82.3666, country: 'Cuba' },
      'kingston': { name: 'Kingston, Jamaica', lat: 17.9712, lng: -76.7926, country: 'Jamaica' },
      'port of spain': { name: 'Port of Spain, Trinidad and Tobago', lat: 10.6596, lng: -61.5190, country: 'Trinidad and Tobago' },
      'bridgetown': { name: 'Bridgetown, Barbados', lat: 13.1132, lng: -59.5988, country: 'Barbados' },
      'georgetown': { name: 'Georgetown, Guyana', lat: 6.8013, lng: -58.1553, country: 'Guyana' },
      'paramaribo': { name: 'Paramaribo, Suriname', lat: 5.8520, lng: -55.2038, country: 'Suriname' },
      'quito': { name: 'Quito, Ecuador', lat: -0.1807, lng: -78.4678, country: 'Ecuador' },
      'la paz': { name: 'La Paz, Bolivia', lat: -16.4897, lng: -68.1193, country: 'Bolivia' },
      'asuncion': { name: 'Asunción, Paraguay', lat: -25.2637, lng: -57.5759, country: 'Paraguay' },
      'montevideo': { name: 'Montevideo, Uruguay', lat: -34.9011, lng: -56.1645, country: 'Uruguay' }
    };

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchedCities = Object.entries(localCities)
      .filter(([key, city]) => 
        key.includes(normalizedQuery) || 
        city.name.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 10)
      .map(([key, city]) => ({
        ...city,
        type: 'local'
      }));

    setResults(matchedCities);
  };

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length >= 2) {
      searchLocation(value);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setQuery(location.name);
    setShowResults(false);
    
    // Add to recent searches
    const updatedRecent = [
      location,
      ...recentSearches.filter(item => item.name !== location.name)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentLocations', JSON.stringify(updatedRecent));
    
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocode to get location name
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          )
            .then(response => response.json())
            .then(data => {
              const location = {
                name: data.display_name,
                lat: latitude,
                lng: longitude,
                country: data.address?.country,
                state: data.address?.state,
                city: data.address?.city || data.address?.town,
                type: 'current'
              };
              handleLocationSelect(location);
            })
            .catch(() => {
              // Fallback to coordinates only
              const location = {
                name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                lat: latitude,
                lng: longitude,
                type: 'current'
              };
              handleLocationSelect(location);
            })
            .finally(() => setLoading(false));
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search for a city, town, or location..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
        />
        <button
          onClick={getCurrentLocation}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          title="Use current location"
        >
          <Globe className="h-5 w-5 text-gray-400 hover:text-purple-500" />
        </button>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto"
          >
            {loading && (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-2">Searching locations...</p>
              </div>
            )}

            {!loading && results.length === 0 && query.length >= 2 && (
              <div className="p-4 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No locations found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="py-2">
                {results.map((location, index) => (
                  <button
                    key={`${location.name}-${index}`}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {location.city || location.name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {location.state && `${location.state}, `}{location.country}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 ml-2">
                        {location.type === 'current' && '📍'}
                        {location.type === 'recent' && '🕒'}
                        {location.type === 'popular' && '⭐'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && recentSearches.length > 0 && results.length === 0 && (
              <div className="border-t border-gray-200">
                <div className="px-4 py-2 bg-gray-50">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                  </div>
                </div>
                {recentSearches.map((location, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {location.city || location.name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {location.state && `${location.state}, `}{location.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && results.length === 0 && recentSearches.length === 0 && (
              <div className="border-t border-gray-200">
                <div className="px-4 py-2 bg-gray-50">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Popular Cities</span>
                  </div>
                </div>
                {popularCities.map((city, index) => (
                  <button
                    key={`popular-${index}`}
                    onClick={() => handleLocationSelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {city.name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {city.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearch;
