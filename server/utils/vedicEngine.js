let swisseph;
try {
  // Optional native module; may fail on serverless
  // eslint-disable-next-line import/no-unresolved
  swisseph = require('swisseph');
} catch (err) {
  console.warn('Swiss Ephemeris not available, using fallback calculations only.');
  swisseph = null;
}
const moment = require('moment');
const path = require('path');
const { analyzeClassicalPrinciples } = require('./classicalPrinciples');
const NakshatraSystem = require('./nakshatraSystem');
const PlanetaryStrengthCalculator = require('./planetaryStrength');

class VedicAstrologyEngine {
  constructor() {
    this.planets = {
      SUN: 0, MOON: 1, MERCURY: 2, VENUS: 3, MARS: 4,
      JUPITER: 5, SATURN: 6, URANUS: 7, NEPTUNE: 8, PLUTO: 9,
      RAHU: 10, KETU: 11  // Lunar nodes
    };
    
    // Initialize enhanced systems
    this.nakshatraSystem = new NakshatraSystem();
    this.strengthCalculator = new PlanetaryStrengthCalculator();
    
    this.houses = {
      ARIES: 0, TAURUS: 1, GEMINI: 2, CANCER: 3,
      LEO: 4, VIRGO: 5, LIBRA: 6, SCORPIO: 7,
      SAGITTARIUS: 8, CAPRICORN: 9, AQUARIUS: 10, PISCES: 11
    };
    
    // Benefic and malefic planet weights for positivity scoring
    this.planetWeights = {
      SUN: 0.3,      // Neutral to slightly positive
      MOON: 0.8,     // Highly benefic
      MERCURY: 0.6,  // Benefic
      VENUS: 0.9,    // Highly benefic
      MARS: -0.4,    // Malefic
      JUPITER: 0.9,  // Highly benefic
      SATURN: -0.6,  // Malefic
      URANUS: 0.2,   // Slightly positive
      NEPTUNE: 0.4,  // Benefic
      PLUTO: -0.2    // Slightly negative
    };
    
    // House weights for positivity scoring
    this.houseWeights = {
      1: 0.8,   // Ascendant - highly positive
      2: 0.4,   // Wealth - positive
      3: 0.3,   // Communication - slightly positive
      4: 0.7,   // Home - positive
      5: 0.9,   // Creativity/Children - highly positive
      6: -0.3,  // Health/Enemies - slightly negative
      7: 0.6,   // Partnership - positive
      8: -0.5,  // Transformation - negative
      9: 0.9,   // Fortune - highly positive
      10: 0.8,  // Career - highly positive
      11: 0.7,  // Gains - positive
      12: -0.4  // Losses - negative
    };
    
    // Initialize Swiss Ephemeris if available
    if (swisseph && typeof swisseph.swe_set_ephe_path === 'function') {
      swisseph.swe_set_ephe_path(path.join(__dirname, '../ephemeris'));
    }
  }

  // Calculate planetary positions for a given date and location
  calculatePlanetaryPositions(date, latitude, longitude) {
    console.log('🪐 Calculating planetary positions for date:', date);
    console.log('📍 Location:', latitude, longitude);
    const julianDay = this.dateToJulianDay(date);
    console.log('📅 Julian Day:', julianDay);
    
    const positions = {};
    
    Object.keys(this.planets).forEach(planet => {
      if (['URANUS', 'NEPTUNE', 'PLUTO'].includes(planet)) {
        // Skip outer planets in traditional Vedic astrology
        return;
      }

      try {
        console.log(`  Calculating ${planet} with nakshatra...`);
        let result;
        
        if (swisseph && typeof swisseph.swe_calc_ut === 'function') {
          if (['RAHU', 'KETU'].includes(planet)) {
            // Calculate lunar nodes
            const nodeResult = swisseph.swe_calc_ut(julianDay, swisseph.SE_MEAN_NODE, swisseph.SEFLG_SWIEPH);
            result = {
              longitude: planet === 'RAHU' ? nodeResult.longitude : (nodeResult.longitude + 180) % 360,
              latitude: 0, // Nodes have no latitude
              distance: nodeResult.distance
            };
          } else {
            result = swisseph.swe_calc_ut(julianDay, this.planets[planet], swisseph.SEFLG_SWIEPH);
          }
        } else {
          // Fallback deterministic approximation
          const seed = (new Date(date).getTime() / (1000 * 60 * 60 * 24)) % 360;
          const offsetMap = { 
            SUN: 0, MOON: 13, MERCURY: 4, VENUS: 1.6, MARS: 0.5, 
            JUPITER: 0.08, SATURN: 0.03, RAHU: -0.05, KETU: -0.05 
          };
          const speed = offsetMap[planet] || 1;
          result = {
            longitude: (seed * speed) % 360,
            latitude: 0,
            distance: 1
          };
        }

        // Calculate nakshatra for this planet
        const nakshatra = this.nakshatraSystem.calculateNakshatra(result.longitude);
        
        // Calculate planetary dignity and strength
        const dignity = this.strengthCalculator.calculatePlanetaryDignity(planet, result.longitude);
        const spiritualStrength = this.strengthCalculator.calculateSpiritualStrength(
          planet, result.longitude, nakshatra
        );

        positions[planet] = {
          longitude: result.longitude,
          latitude: result.latitude,
          distance: result.distance,
          house: this.getHouseFromLongitude(result.longitude, latitude, longitude, julianDay),
          nakshatra: nakshatra,
          dignity: dignity,
          spiritual_strength: spiritualStrength,
          sign: this.strengthCalculator.getSignFromLongitude(result.longitude)
        };

        console.log(`  ✅ ${planet}: ${nakshatra ? nakshatra.name : 'Unknown'} nakshatra, ${dignity.status} dignity, House ${positions[planet].house}`);
        
      } catch (error) {
        console.error(`❌ Error calculating ${planet}:`, error);
        // Provide minimal fallback
        positions[planet] = {
          longitude: 0,
          latitude: 0,
          distance: 1,
          house: 1,
          nakshatra: null,
          dignity: { status: 'UNKNOWN', strength: 0 },
          spiritual_strength: 0.5
        };
      }
    });
    
    // Calculate overall chart strength and planetary interactions
    const nakshatraData = this.extractNakshatraData(positions);
    const overallStrength = this.strengthCalculator.calculateOverallPlanetaryStrength(positions, nakshatraData);
    
    console.log('✅ Planetary positions calculation complete');
    console.log(`📊 Chart strength: ${overallStrength.overall_chart_strength.chart_grade}`);
    
    return {
      ...positions,
      chart_analysis: overallStrength
    };
  }
  
  // Extract nakshatra data for strength calculations
  extractNakshatraData(positions) {
    const nakshatraData = {};
    for (const [planet, position] of Object.entries(positions)) {
      if (position && position.nakshatra) {
        nakshatraData[planet] = position.nakshatra;
      }
    }
    return nakshatraData;
  }

  // Convert date to Julian Day
  dateToJulianDay(date) {
    const momentDate = moment(date);
    const year = momentDate.year();
    const month = momentDate.month() + 1;
    const day = momentDate.date();
    const hour = momentDate.hour();
    const minute = momentDate.minute();
    
    if (swisseph && typeof swisseph.swe_julday === 'function') {
      return swisseph.swe_julday(year, month, day, hour + minute / 60, swisseph.SE_GREG_CAL);
    }
    // Unix epoch (ms) to Julian Day approximation
    return (momentDate.valueOf() / 86400000) + 2440587.5;
  }

  // Calculate Ascendant (Rising Sign) for location
  calculateAscendant(julianDay, latitude, longitude) {
    try {
      if (swisseph && typeof swisseph.swe_houses === 'function') {
        const houses = swisseph.swe_houses(julianDay, latitude, longitude, 'P'); // P = Placidus
        return {
          ascendant: houses.ascendant,
          mc: houses.mc,
          armc: houses.armc,
          vertex: houses.vertex,
          equatorialAscendant: houses.equasc,
          houseCusps: houses.cusps
        };
      }
      throw new Error('Swiss ephemeris not available');
    } catch (error) {
      console.error('❌ Error calculating ascendant:', error);
      // Fallback to simplified calculation based on location
      return this.calculateSimplifiedHouses(latitude, longitude);
    }
  }

  // Simplified house calculation based on location
  calculateSimplifiedHouses(latitude, longitude) {
    // Use location to create different house cusps
    // This ensures different locations produce different house assignments
    
    // Create location-based offset for house cusps
    const locationOffset = (latitude + longitude) % 360;
    const baseCusps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
    
    // Apply location-based rotation to house cusps
    const rotatedCusps = baseCusps.map(cusp => (cusp + locationOffset) % 360);
    
    return {
      ascendant: locationOffset,
      mc: (locationOffset + 90) % 360,
      armc: locationOffset,
      vertex: 0,
      equatorialAscendant: 0,
      houseCusps: rotatedCusps
    };
  }

  // Get house from longitude with proper house system
  getHouseFromLongitude(longitude, latitude, longitude_location, julianDay) {
    try {
      // Create location-based house system that varies by location
      const locationOffset = (latitude + longitude_location) % 360;
      
      // Create house cusps based on location
      const houseCusps = [];
      for (let i = 0; i <= 12; i++) {
        houseCusps.push((i * 30 + locationOffset) % 360);
      }
      
      // Find which house this longitude falls into
      for (let i = 1; i <= 12; i++) {
        const startCusp = houseCusps[i];
        const endCusp = houseCusps[i + 1] || houseCusps[1];
        
        // Handle 0-360 degree wrap-around
        if (startCusp <= endCusp) {
          if (longitude >= startCusp && longitude < endCusp) {
            return i;
          }
        } else {
          // Handle case where house spans 0 degrees
          if (longitude >= startCusp || longitude < endCusp) {
            return i;
          }
        }
      }
      
      // Fallback to simplified calculation
      return Math.floor(longitude / 30) + 1;
    } catch (error) {
      console.error('❌ Error in house calculation, using fallback:', error);
      return Math.floor(longitude / 30) + 1;
    }
  }

  // Calculate Dasha periods
  calculateDasha(birthDate, targetDate) {
    const birthMoment = moment(birthDate);
    const targetMoment = moment(targetDate);
    const ageInYears = targetMoment.diff(birthMoment, 'years', true);
    
    // Simplified Vimshottari Dasha calculation
    const dashaPeriods = [
      { planet: 'SUN', years: 6 },
      { planet: 'MOON', years: 10 },
      { planet: 'MARS', years: 7 },
      { planet: 'RAHU', years: 18 },
      { planet: 'JUPITER', years: 16 },
      { planet: 'SATURN', years: 19 },
      { planet: 'MERCURY', years: 17 },
      { planet: 'KETU', years: 7 },
      { planet: 'VENUS', years: 20 }
    ];
    
    let currentDasha = null;
    let runningYears = 0;
    
    for (const period of dashaPeriods) {
      runningYears += period.years;
      if (ageInYears < runningYears) {
        currentDasha = period.planet;
        break;
      }
    }
    
    return currentDasha || 'SUN';
  }

  // Calculate positivity score for a given date
  calculatePositivityScore(birthDate, targetDate, latitude, longitude) {
    const planetaryPositions = this.calculatePlanetaryPositions(targetDate, latitude, longitude);
    const dasha = this.calculateDasha(birthDate, targetDate);
    
    let totalScore = 0;
    let planetCount = 0;
    
    // Calculate planetary influence
    Object.keys(planetaryPositions).forEach(planet => {
      if (this.planetWeights[planet]) {
        const position = planetaryPositions[planet];
        const planetWeight = this.planetWeights[planet];
        const houseWeight = this.houseWeights[position.house] || 0;
        
        // Combined influence of planet and house
        const influence = (planetWeight + houseWeight) / 2;
        totalScore += influence;
        planetCount++;
      }
    });
    
    // Add Dasha influence
    const dashaWeight = this.planetWeights[dasha] || 0;
    totalScore += dashaWeight * 0.5; // Dasha has 50% additional weight
    
    // Normalize score to range -1 to 1
    const normalizedScore = totalScore / (planetCount + 0.5);
    
    return Math.max(-1, Math.min(1, normalizedScore));
  }

  // Generate positivity sinusoid data points
  generatePositivitySinusoid(birthDate, endDate, latitude, longitude, dataPoints = 365) {
    const birthMoment = moment(birthDate);
    const endMoment = moment(endDate);
    const totalDays = endMoment.diff(birthMoment, 'days');
    
    const sinusoidData = [];
    
    for (let i = 0; i <= dataPoints; i++) {
      const currentDate = moment(birthDate).add((totalDays * i) / dataPoints, 'days');
      const positivityScore = this.calculatePositivityScore(
        birthDate,
        currentDate.toDate(),
        latitude,
        longitude
      );
      
      sinusoidData.push({
        date: currentDate.format('YYYY-MM-DD'),
        score: positivityScore,
        timestamp: currentDate.valueOf()
      });
    }
    
    return sinusoidData;
  }

  // Calculate aspects between planets
  calculateAspects(planetaryPositions) {
    const aspects = [];
    const planetNames = Object.keys(planetaryPositions);
    
    for (let i = 0; i < planetNames.length; i++) {
      for (let j = i + 1; j < planetNames.length; j++) {
        const planet1 = planetNames[i];
        const planet2 = planetNames[j];
        const pos1 = planetaryPositions[planet1].longitude;
        const pos2 = planetaryPositions[planet2].longitude;
        
        const angle = Math.abs(pos1 - pos2);
        const aspect = this.getAspectType(angle);
        
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
  }

  // Get aspect type and influence
  getAspectType(angle) {
    const tolerance = 8; // 8 degrees tolerance
    
    if (Math.abs(angle - 0) <= tolerance) return { type: 'conjunction', influence: -0.3 };
    if (Math.abs(angle - 60) <= tolerance) return { type: 'sextile', influence: 0.4 };
    if (Math.abs(angle - 90) <= tolerance) return { type: 'square', influence: -0.5 };
    if (Math.abs(angle - 120) <= tolerance) return { type: 'trine', influence: 0.6 };
    if (Math.abs(angle - 180) <= tolerance) return { type: 'opposition', influence: -0.4 };
    
    return null;
  }

  // Generate comprehensive prediction
  generatePrediction(birthDate, targetDate, latitude, longitude, milestones = []) {
    console.log('🚀 Starting Vedic Astrology Prediction Generation...');
    console.log('📍 Location:', latitude, longitude);
    console.log('📅 Birth Date:', birthDate);
    console.log('🎯 Target Date:', targetDate);
    console.log('📝 Milestones:', milestones.length);
    
    // Calculate current planetary positions
    console.log('🪐 Calculating planetary positions...');
    const planetaryPositions = this.calculatePlanetaryPositions(targetDate, latitude, longitude);
    console.log('✅ Planetary positions calculated:', Object.keys(planetaryPositions).length, 'planets');

    // Classical insights (Brihat Parashara Hora Shastra, Saravali, Phaladeepika, etc.)
    const classicalInsights = analyzeClassicalPrinciples(planetaryPositions);
    console.log('📚 Classical adjustment:', classicalInsights.classicalAdjustment);
    
    // Calculate aspects between planets
    console.log('🔗 Calculating planetary aspects...');
    const aspects = this.calculateAspects(planetaryPositions);
    console.log('✅ Aspects calculated:', aspects.length, 'aspects');
    
    // Calculate current dasha period
    console.log('⏰ Calculating dasha period...');
    const dasha = this.calculateDasha(birthDate, targetDate);
    console.log('✅ Current dasha period:', dasha);
    
    // Calculate spiritual connections and birth nakshatra
    console.log('🕉️ Calculating spiritual connections...');
    const birthMoonNakshatra = planetaryPositions.MOON ? planetaryPositions.MOON.nakshatra : null;
    const spiritualProfile = this.calculateSpiritualProfile(planetaryPositions, birthMoonNakshatra);
    console.log(`✅ Birth Moon Nakshatra: ${birthMoonNakshatra ? birthMoonNakshatra.name : 'Unknown'}`);
    
    // Calculate current positivity score (base) with spiritual enhancements
    console.log('📊 Calculating enhanced positivity score...');
    const positivityScore = this.calculateEnhancedPositivityScore(birthDate, targetDate, latitude, longitude, planetaryPositions);
    // Apply classical and spiritual adjustments
    const spiritualAdjustment = spiritualProfile.overall_spiritual_strength * 0.2;
    const adjustedPositivityScore = Math.max(-1, Math.min(1, 
      positivityScore + (classicalInsights.classicalAdjustment || 0) + spiritualAdjustment
    ));
    console.log('✅ Positivity score (base, adjusted, spiritual):', positivityScore, adjustedPositivityScore, spiritualAdjustment);
    
    // Generate sinusoid data
    console.log('📈 Generating sinusoid data...');
    const sinusoidData = this.generatePositivitySinusoid(
      birthDate,
      targetDate,
      latitude,
      longitude
    );
    console.log('✅ Sinusoid data generated:', sinusoidData.length, 'data points');
    
    // Analyze milestone alignment
    console.log('🎯 Analyzing milestones...');
    const milestoneAnalysis = milestones.map(milestone => {
      const milestoneDate = moment(milestone.date);
      const milestoneScore = this.calculatePositivityScore(
        birthDate,
        milestoneDate.toDate(),
        latitude,
        longitude
      );
      
      return {
        ...milestone,
        positivityScore: milestoneScore,
        alignment: this.getAlignmentDescription(milestoneScore)
      };
    });
    console.log('✅ Milestone analysis completed:', milestoneAnalysis.length, 'milestones');
    
    // Generate prediction text
    console.log('🔮 Generating prediction text...');
    const prediction = this.generatePredictionText(adjustedPositivityScore, dasha, aspects);
    console.log('✅ Prediction text generated');
    
    // Generate future projections
    console.log('🔮 Generating future projections...');
    const futureProjections = this.generateFutureProjections(birthDate, dasha, adjustedPositivityScore);
    console.log('✅ Future projections generated:', futureProjections.length, 'months');
    
    // Fit sinusoidal trend to historical data and project future
    console.log('🔬 Fitting sinusoidal trend to historical data...');
    const sinusoidalTrend = this.fitSinusoidalTrend(sinusoidData, 24);
    console.log('✅ Sinusoidal trend analysis complete');
    console.log('📊 Trend Statistics:', {
      rSquared: sinusoidalTrend.rSquared.toFixed(3),
      trendStrength: sinusoidalTrend.trendStrength.toFixed(3),
      projectedPoints: sinusoidalTrend.projected.length
    });
    
    console.log('🎉 Vedic Astrology Prediction Generation Complete!');
    
    return {
      planetaryPositions,
      aspects,
      dasha,
      positivityScore, // base
      adjustedPositivityScore, // adjusted using classical texts and spiritual factors
      spiritualProfile,
      classicalInsights,
      sinusoidData,
      milestoneAnalysis,
      prediction,
      futureProjections,
      sinusoidalTrend
    };
  }

  // Get alignment description
  getAlignmentDescription(score) {
    if (score >= 0.7) return 'Excellent alignment with cosmic energies';
    if (score >= 0.4) return 'Good alignment with positive influences';
    if (score >= 0.1) return 'Moderate alignment with mixed influences';
    if (score >= -0.2) return 'Challenging period with growth opportunities';
    return 'Difficult period requiring patience and resilience';
  }

  // Generate future projections (next 2 years)
  generateFutureProjections(birthDate, dasha, positivityScore) {
    const projections = [];
    const currentDate = new Date();
    
    for (let i = 1; i <= 24; i++) {
      const futureDate = new Date(currentDate);
      futureDate.setMonth(currentDate.getMonth() + i);
      
      // Calculate future positivity score based on dasha progression and planetary movements
      const baseScore = positivityScore;
      const monthlyVariation = Math.sin(i * 0.3) * 0.2; // Cyclical variation
      const dashaInfluence = this.getDashaInfluence(dasha, i);
      const futureScore = Math.max(-1, Math.min(1, baseScore + monthlyVariation + dashaInfluence));
      
      projections.push({
        month: futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        positivityScore: futureScore,
        date: futureDate.toISOString().split('T')[0],
        dashaInfluence: dashaInfluence,
        cosmicPhase: this.getCosmicPhase(futureScore)
      });
    }
    
    return projections;
  }

  // Fit sinusoidal line of best fit to historical data and project future
  fitSinusoidalTrend(sinusoidData, projectionMonths = 24) {
    console.log('🔬 Fitting sinusoidal trend to historical data...');
    
    if (!sinusoidData || sinusoidData.length < 10) {
      console.log('⚠️ Insufficient data for trend fitting, using fallback');
      return this.generateFallbackTrend(projectionMonths);
    }

    // Extract time series data
    const timeSeries = sinusoidData.map((point, index) => ({
      x: index,
      y: point.score,
      date: point.date
    }));

    // Fit multiple sinusoidal components using least squares
    const trend = this.fitMultiSinusoidal(timeSeries, projectionMonths);
    
    console.log('✅ Sinusoidal trend fitted successfully');
    return trend;
  }

  // Fit multi-sinusoidal model using least squares optimization
  fitMultiSinusoidal(timeSeries, projectionMonths) {
    const n = timeSeries.length;
    const x = timeSeries.map(p => p.x);
    const y = timeSeries.map(p => p.y);
    
    // Define multiple frequency components for astrological cycles
    const frequencies = [
      2 * Math.PI / 365,    // Annual cycle
      2 * Math.PI / 182.5,  // Semi-annual cycle  
      2 * Math.PI / 121.7,  // 4-month cycle
      2 * Math.PI / 91.25,  // 3-month cycle
      2 * Math.PI / 60.8    // 2-month cycle
    ];
    
    // Build design matrix for least squares
    const A = [];
    for (let i = 0; i < n; i++) {
      const row = [1]; // Constant term
      for (const freq of frequencies) {
        row.push(Math.cos(freq * x[i]));
        row.push(Math.sin(freq * x[i]));
      }
      A.push(row);
    }
    
    // Solve least squares: A * params = y
    const params = this.solveLeastSquares(A, y);
    
    // Generate fitted curve for historical data
    const fittedHistorical = [];
    for (let i = 0; i < n; i++) {
      let fittedValue = params[0]; // Constant term
      for (let j = 0; j < frequencies.length; j++) {
        const freq = frequencies[j];
        fittedValue += params[1 + 2*j] * Math.cos(freq * x[i]);
        fittedValue += params[2 + 2*j] * Math.sin(freq * x[i]);
      }
      fittedHistorical.push({
        x: x[i],
        y: fittedValue,
        date: timeSeries[i].date,
        original: y[i],
        residual: y[i] - fittedValue
      });
    }
    
    // Project future values
    const projectedFuture = [];
    for (let month = 1; month <= projectionMonths; month++) {
      const futureX = n + (month * 30); // Approximate days per month
      let projectedValue = params[0]; // Constant term
      
      for (let j = 0; j < frequencies.length; j++) {
        const freq = frequencies[j];
        projectedValue += params[1 + 2*j] * Math.cos(freq * futureX);
        projectedValue += params[2 + 2*j] * Math.sin(freq * futureX);
      }
      
      // Clamp to valid range
      projectedValue = Math.max(-1, Math.min(1, projectedValue));
      
      const futureDate = moment().add(month, 'months');
      projectedFuture.push({
        month: month,
        x: futureX,
        y: projectedValue,
        date: futureDate.format('YYYY-MM-DD'),
        confidence: this.calculateConfidence(month, params)
      });
    }
    
    return {
      historical: fittedHistorical,
      projected: projectedFuture,
      parameters: params,
      frequencies: frequencies,
      rSquared: this.calculateRSquared(y, fittedHistorical.map(p => p.y)),
      trendStrength: this.calculateTrendStrength(fittedHistorical)
    };
  }

  // Solve least squares problem using QR decomposition
  solveLeastSquares(A, b) {
    const m = A.length;
    const n = A[0].length;
    
    // QR decomposition using Gram-Schmidt
    const Q = [];
    const R = [];
    
    for (let i = 0; i < m; i++) {
      Q[i] = new Array(n).fill(0);
      R[i] = new Array(n).fill(0);
    }
    
    for (let j = 0; j < n; j++) {
      let v = A.map(row => row[j]);
      
      for (let k = 0; k < j; k++) {
        const dot = this.dotProduct(A.map(row => row[j]), Q.map(row => row[k]));
        R[k][j] = dot;
        for (let i = 0; i < m; i++) {
          v[i] -= R[k][j] * Q[i][k];
        }
      }
      
      const norm = Math.sqrt(this.dotProduct(v, v));
      R[j][j] = norm;
      
      for (let i = 0; i < m; i++) {
        Q[i][j] = v[i] / norm;
      }
    }
    
    // Solve R * x = Q^T * b
    const QtB = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        QtB[i] += Q[j][i] * b[j];
      }
    }
    
    // Back substitution
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = QtB[i];
      for (let j = i + 1; j < n; j++) {
        sum -= R[i][j] * x[j];
      }
      x[i] = sum / R[i][i];
    }
    
    return x;
  }

  // Helper functions for mathematical operations
  dotProduct(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  calculateRSquared(actual, predicted) {
    const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
    const ssRes = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
    const ssTot = actual.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    return 1 - (ssRes / ssTot);
  }

  calculateTrendStrength(fittedData) {
    const values = fittedData.map(p => p.y);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateConfidence(month, params) {
    // Confidence decreases with time into the future
    const baseConfidence = 0.85;
    const decayRate = 0.02; // 2% decay per month
    return Math.max(0.3, baseConfidence - (month * decayRate));
  }

  generateFallbackTrend(projectionMonths) {
    console.log('🔄 Using fallback trend generation');
    const projected = [];
    
    for (let month = 1; month <= projectionMonths; month++) {
      const futureDate = moment().add(month, 'months');
      const score = 0.1 * Math.sin((month * Math.PI) / 12) + 0.05 * Math.sin((month * Math.PI) / 6);
      
      projected.push({
        month: month,
        x: month,
        y: score,
        date: futureDate.format('YYYY-MM-DD'),
        confidence: Math.max(0.3, 0.7 - (month * 0.02))
      });
    }
    
    return {
      historical: [],
      projected: projected,
      parameters: [0, 0.1, 0.05],
      frequencies: [2 * Math.PI / 12, 2 * Math.PI / 6],
      rSquared: 0.5,
      trendStrength: 0.1
    };
  }

  // Get dasha influence for future projections
  getDashaInfluence(currentDasha, monthsAhead) {
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
    return influence * Math.cos(monthsAhead * 0.2); // Cyclical dasha influence
  }

  // Get cosmic phase description
  getCosmicPhase(score) {
    if (score >= 0.7) return 'Excellence';
    if (score >= 0.4) return 'Growth';
    if (score >= 0.1) return 'Balance';
    if (score >= -0.2) return 'Challenge';
    return 'Transformation';
  }

  // Generate prediction text
  generatePredictionText(positivityScore, dasha, aspects) {
    let prediction = '';
    
    // Dasha influence
    const dashaInfluence = this.planetWeights[dasha] || 0;
    if (dashaInfluence > 0.5) {
      prediction += `You are currently in a ${dasha} dasha period, which brings favorable energies. `;
    } else if (dashaInfluence < -0.3) {
      prediction += `You are in a ${dasha} dasha period, which may present challenges for growth. `;
    }
    
    // Overall positivity
    if (positivityScore > 0.6) {
      prediction += 'This is an excellent time for new beginnings and positive changes. ';
    } else if (positivityScore > 0.3) {
      prediction += 'The cosmic energies are generally supportive of your endeavors. ';
    } else if (positivityScore > 0) {
      prediction += 'Mixed influences suggest careful planning and patience. ';
    } else {
      prediction += 'This period may require extra effort and resilience. ';
    }
    
    // Aspect influences
    const positiveAspects = aspects.filter(a => a.influence > 0);
    const challengingAspects = aspects.filter(a => a.influence < 0);
    
    if (positiveAspects.length > challengingAspects.length) {
      prediction += 'Harmonious planetary aspects indicate smooth progress. ';
    } else if (challengingAspects.length > positiveAspects.length) {
      prediction += 'Challenging aspects suggest the need for careful decision-making. ';
    }
    
    return prediction;
  }

  // Calculate comprehensive spiritual profile
  calculateSpiritualProfile(planetaryPositions, birthMoonNakshatra) {
    const profile = {
      birth_moon_nakshatra: birthMoonNakshatra,
      spiritual_strengths: {},
      karmic_indicators: {},
      spiritual_path: null,
      spiritual_challenges: [],
      spiritual_gifts: [],
      overall_spiritual_strength: 0
    };

    let totalSpiritualStrength = 0;
    let planetCount = 0;

    // Analyze each planet's spiritual contribution
    for (const [planet, position] of Object.entries(planetaryPositions)) {
      if (!position || !position.spiritual_strength) continue;

      const spiritualStrength = position.spiritual_strength || 0;
      totalSpiritualStrength += spiritualStrength;
      planetCount++;

      profile.spiritual_strengths[planet] = {
        strength: spiritualStrength,
        nakshatra: position.nakshatra,
        dignity: position.dignity,
        spiritual_lessons: position.nakshatra ? position.nakshatra.spiritual_lesson : null
      };

      // Special spiritual indicators
      if (planet === 'JUPITER' && spiritualStrength > 0.7) {
        profile.spiritual_gifts.push('Strong wisdom and teaching abilities');
      }
      if (planet === 'KETU' && spiritualStrength > 0.6) {
        profile.spiritual_gifts.push('Natural inclination toward moksha and liberation');
      }
      if (planet === 'MOON' && position.nakshatra) {
        profile.spiritual_path = this.determineSpiritualPath(position.nakshatra);
      }
    }

    profile.overall_spiritual_strength = planetCount > 0 ? totalSpiritualStrength / planetCount : 0.5;

    // Determine karmic indicators
    profile.karmic_indicators = this.analyzeKarmicIndicators(planetaryPositions);

    // Identify spiritual challenges and gifts based on planetary positions
    profile.spiritual_challenges = this.identifySpiritualChallenges(planetaryPositions);
    profile.spiritual_gifts = [...profile.spiritual_gifts, ...this.identifySpiritualGifts(planetaryPositions)];

    return profile;
  }

  // Determine spiritual path based on Moon nakshatra
  determineSpiritualPath(moonNakshatra) {
    const pathMap = {
      'Ashwini': 'Path of healing and service',
      'Bharani': 'Path of transformation and moral strength',
      'Krittika': 'Path of purification and righteous action',
      'Rohini': 'Path of creative manifestation and beauty',
      'Mrigashirsha': 'Path of eternal seeking and knowledge',
      'Ardra': 'Path of intense transformation and renewal',
      'Punarvasu': 'Path of renewal and cyclical wisdom',
      'Pushya': 'Path of nourishment and spiritual teaching',
      'Ashlesha': 'Path of mystical wisdom and kundalini',
      'Magha': 'Path of ancestral wisdom and tradition',
      'Purva Phalguni': 'Path of creative expression and enjoyment',
      'Uttara Phalguni': 'Path of service and reliable support',
      'Hasta': 'Path of skillful manifestation and healing',
      'Chitra': 'Path of divine artistry and cosmic architecture',
      'Swati': 'Path of independence and diplomatic wisdom',
      'Vishakha': 'Path of determined spiritual achievement',
      'Anuradha': 'Path of devotion and harmonious relationships',
      'Jyeshtha': 'Path of protection and occult knowledge',
      'Mula': 'Path of root investigation and fundamental truth',
      'Purva Ashadha': 'Path of invincible righteousness',
      'Uttara Ashadha': 'Path of universal truth and final victory',
      'Shravana': 'Path of learning and divine knowledge',
      'Dhanishta': 'Path of wealth and group harmony',
      'Shatabhisha': 'Path of healing and mystical innovation',
      'Purva Bhadrapada': 'Path of spiritual transformation and sacrifice',
      'Uttara Bhadrapada': 'Path of cosmic consciousness and deep wisdom',
      'Revati': 'Path of completion and universal nourishment'
    };

    return pathMap[moonNakshatra.name] || 'Path of general spiritual development';
  }

  // Analyze karmic indicators
  analyzeKarmicIndicators(planetaryPositions) {
    const indicators = {
      rahu_position: null,
      ketu_position: null,
      saturn_lessons: null,
      karmic_debts: [],
      karmic_gifts: []
    };

    if (planetaryPositions.RAHU) {
      indicators.rahu_position = {
        house: planetaryPositions.RAHU.house,
        nakshatra: planetaryPositions.RAHU.nakshatra,
        lesson: 'Material desires and worldly achievements to balance'
      };
    }

    if (planetaryPositions.KETU) {
      indicators.ketu_position = {
        house: planetaryPositions.KETU.house,
        nakshatra: planetaryPositions.KETU.nakshatra,
        lesson: 'Past life skills and spiritual detachment'
      };
    }

    if (planetaryPositions.SATURN) {
      const saturnDignity = planetaryPositions.SATURN.dignity;
      if (saturnDignity && saturnDignity.strength < 0) {
        indicators.karmic_debts.push('Need to develop discipline and patience');
      } else {
        indicators.karmic_gifts.push('Natural discipline and perseverance');
      }
    }

    return indicators;
  }

  // Identify spiritual challenges
  identifySpiritualChallenges(planetaryPositions) {
    const challenges = [];

    // Check for debilitated planets
    for (const [planet, position] of Object.entries(planetaryPositions)) {
      if (!position || !position.dignity) continue;
      
      if (position.dignity.status === 'DEBILITATION') {
        const challengeMap = {
          SUN: 'Challenge with ego and self-confidence',
          MOON: 'Emotional instability and mental peace challenges',
          MARS: 'Anger management and channeling energy constructively',
          MERCURY: 'Communication and analytical thinking challenges',
          JUPITER: 'Wisdom and spiritual guidance challenges',
          VENUS: 'Relationships and material attachment challenges',
          SATURN: 'Discipline and patience development needed'
        };
        
        if (challengeMap[planet]) {
          challenges.push(challengeMap[planet]);
        }
      }
    }

    return challenges;
  }

  // Identify spiritual gifts
  identifySpiritualGifts(planetaryPositions) {
    const gifts = [];

    // Check for exalted planets
    for (const [planet, position] of Object.entries(planetaryPositions)) {
      if (!position || !position.dignity) continue;
      
      if (position.dignity.status === 'EXALTATION') {
        const giftMap = {
          SUN: 'Natural leadership and soul radiance',
          MOON: 'Deep intuition and emotional wisdom',
          MARS: 'Courage and righteous action',
          MERCURY: 'Brilliant communication and analytical skills',
          JUPITER: 'Profound wisdom and spiritual teaching ability',
          VENUS: 'Divine love and artistic beauty',
          SATURN: 'Exceptional discipline and organizational skills'
        };
        
        if (giftMap[planet]) {
          gifts.push(giftMap[planet]);
        }
      }
    }

    return gifts;
  }

  // Calculate enhanced positivity score with spiritual factors
  calculateEnhancedPositivityScore(birthDate, targetDate, latitude, longitude, planetaryPositions) {
    // Base positivity calculation
    let baseScore = this.calculatePositivityScore(birthDate, targetDate, latitude, longitude);

    // Add nakshatra-based enhancements
    let nakshatraBonus = 0;
    let strengthBonus = 0;
    let planetCount = 0;

    for (const [planet, position] of Object.entries(planetaryPositions)) {
      if (!position || !position.longitude) continue;
      
      planetCount++;

      // Nakshatra influence
      if (position.nakshatra) {
        const nakshatraStrength = this.nakshatraSystem.calculateSpiritualStrength(position.nakshatra);
        nakshatraBonus += nakshatraStrength * (this.planetWeights[planet] || 0);
      }

      // Dignity influence
      if (position.dignity) {
        strengthBonus += position.dignity.strength * (this.planetWeights[planet] || 0);
      }

      // Spiritual strength influence
      if (position.spiritual_strength) {
        strengthBonus += position.spiritual_strength * 0.1 * (this.planetWeights[planet] || 0);
      }
    }

    // Normalize bonuses
    if (planetCount > 0) {
      nakshatraBonus /= planetCount;
      strengthBonus /= planetCount;
    }

    // Combine all factors
    const enhancedScore = baseScore + (nakshatraBonus * 0.3) + (strengthBonus * 0.4);
    
    return Math.max(-1, Math.min(1, enhancedScore));
  }
}

module.exports = VedicAstrologyEngine;
