/**
 * Enhanced Planetary Strength and Dignity System
 * Based on Shadbala, Ashtakavarga, and traditional Vedic principles
 */

class PlanetaryStrengthCalculator {
  constructor() {
    // Planetary exaltation and debilitation degrees
    this.planetaryDignities = {
      SUN: {
        exaltation: { sign: 'Aries', degree: 10, strength: 1.0 },
        debilitation: { sign: 'Libra', degree: 10, strength: -1.0 },
        mool_trikona: { sign: 'Leo', start: 0, end: 20, strength: 0.8 },
        own_signs: ['Leo'],
        friends: ['MOON', 'MARS', 'JUPITER'],
        enemies: ['VENUS', 'SATURN'],
        neutral: ['MERCURY']
      },
      MOON: {
        exaltation: { sign: 'Taurus', degree: 3, strength: 1.0 },
        debilitation: { sign: 'Scorpio', degree: 3, strength: -1.0 },
        mool_trikona: { sign: 'Taurus', start: 4, end: 20, strength: 0.8 },
        own_signs: ['Cancer'],
        friends: ['SUN', 'MERCURY'],
        enemies: [],
        neutral: ['MARS', 'JUPITER', 'VENUS', 'SATURN']
      },
      MARS: {
        exaltation: { sign: 'Capricorn', degree: 28, strength: 1.0 },
        debilitation: { sign: 'Cancer', degree: 28, strength: -1.0 },
        mool_trikona: { sign: 'Aries', start: 0, end: 12, strength: 0.8 },
        own_signs: ['Aries', 'Scorpio'],
        friends: ['SUN', 'MOON', 'JUPITER'],
        enemies: ['MERCURY'],
        neutral: ['VENUS', 'SATURN']
      },
      MERCURY: {
        exaltation: { sign: 'Virgo', degree: 15, strength: 1.0 },
        debilitation: { sign: 'Pisces', degree: 15, strength: -1.0 },
        mool_trikona: { sign: 'Virgo', start: 16, end: 20, strength: 0.8 },
        own_signs: ['Gemini', 'Virgo'],
        friends: ['SUN', 'VENUS'],
        enemies: ['MOON'],
        neutral: ['MARS', 'JUPITER', 'SATURN']
      },
      JUPITER: {
        exaltation: { sign: 'Cancer', degree: 5, strength: 1.0 },
        debilitation: { sign: 'Capricorn', degree: 5, strength: -1.0 },
        mool_trikona: { sign: 'Sagittarius', start: 0, end: 13, strength: 0.8 },
        own_signs: ['Sagittarius', 'Pisces'],
        friends: ['SUN', 'MOON', 'MARS'],
        enemies: ['MERCURY', 'VENUS'],
        neutral: ['SATURN']
      },
      VENUS: {
        exaltation: { sign: 'Pisces', degree: 27, strength: 1.0 },
        debilitation: { sign: 'Virgo', degree: 27, strength: -1.0 },
        mool_trikona: { sign: 'Libra', start: 0, end: 15, strength: 0.8 },
        own_signs: ['Taurus', 'Libra'],
        friends: ['MERCURY', 'SATURN'],
        enemies: ['SUN', 'MOON'],
        neutral: ['MARS', 'JUPITER']
      },
      SATURN: {
        exaltation: { sign: 'Libra', degree: 20, strength: 1.0 },
        debilitation: { sign: 'Aries', degree: 20, strength: -1.0 },
        mool_trikona: { sign: 'Aquarius', start: 0, end: 20, strength: 0.8 },
        own_signs: ['Capricorn', 'Aquarius'],
        friends: ['MERCURY', 'VENUS'],
        enemies: ['SUN', 'MOON', 'MARS'],
        neutral: ['JUPITER']
      }
    };

    // Sign names for easy lookup
    this.signNames = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    // House strength multipliers
    this.houseStrengths = {
      1: 1.0,   // Ascendant - strongest
      4: 0.9,   // Sukha Bhava
      7: 0.9,   // Yuvati Bhava
      10: 1.0,  // Rajya Bhava - strongest
      2: 0.6,   // Dhana Bhava
      5: 0.8,   // Putra Bhava
      9: 0.8,   // Dharma Bhava
      11: 0.7,  // Labha Bhava
      3: 0.4,   // Sahaja Bhava
      6: 0.3,   // Ripu Bhava
      8: 0.2,   // Ayu Bhava
      12: 0.3   // Vyaya Bhava
    };

    // Directional strength (Dig Bala)
    this.directionalStrength = {
      SUN: 10,     // Strongest in 10th house
      MOON: 4,     // Strongest in 4th house
      MARS: 10,    // Strongest in 10th house
      MERCURY: 1,  // Strongest in 1st house
      JUPITER: 1,  // Strongest in 1st house
      VENUS: 4,    // Strongest in 4th house
      SATURN: 7    // Strongest in 7th house
    };
  }

  // Get sign from longitude
  getSignFromLongitude(longitude) {
    const normalizedLongitude = ((longitude % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedLongitude / 30);
    const degreeInSign = normalizedLongitude % 30;
    
    return {
      sign: this.signNames[signIndex],
      degree: degreeInSign,
      signIndex: signIndex
    };
  }

  // Calculate planetary dignity
  calculatePlanetaryDignity(planet, longitude) {
    const signInfo = this.getSignFromLongitude(longitude);
    const dignity = this.planetaryDignities[planet];
    
    if (!dignity) {
      return { status: 'UNKNOWN', strength: 0, details: 'Planet not recognized' };
    }

    // Check exaltation
    if (signInfo.sign === dignity.exaltation.sign) {
      const degreeDiff = Math.abs(signInfo.degree - dignity.exaltation.degree);
      if (degreeDiff <= 5) { // Within 5 degrees of exact exaltation
        const exactness = 1 - (degreeDiff / 5);
        return {
          status: 'EXALTATION',
          strength: 0.5 + (0.5 * exactness), // 0.5 to 1.0
          details: `Exalted in ${signInfo.sign} at ${signInfo.degree.toFixed(2)}°`,
          exactness: exactness
        };
      }
    }

    // Check debilitation
    if (signInfo.sign === dignity.debilitation.sign) {
      const degreeDiff = Math.abs(signInfo.degree - dignity.debilitation.degree);
      if (degreeDiff <= 5) { // Within 5 degrees of exact debilitation
        const exactness = 1 - (degreeDiff / 5);
        return {
          status: 'DEBILITATION',
          strength: -0.5 - (0.5 * exactness), // -0.5 to -1.0
          details: `Debilitated in ${signInfo.sign} at ${signInfo.degree.toFixed(2)}°`,
          exactness: exactness
        };
      }
    }

    // Check mool trikona
    if (signInfo.sign === dignity.mool_trikona.sign &&
        signInfo.degree >= dignity.mool_trikona.start &&
        signInfo.degree <= dignity.mool_trikona.end) {
      return {
        status: 'MOOL_TRIKONA',
        strength: 0.7,
        details: `Mool Trikona in ${signInfo.sign}`,
        exactness: 1.0
      };
    }

    // Check own sign
    if (dignity.own_signs.includes(signInfo.sign)) {
      return {
        status: 'OWN_SIGN',
        strength: 0.6,
        details: `Own sign ${signInfo.sign}`,
        exactness: 1.0
      };
    }

    // Check friendly/enemy signs (simplified)
    return {
      status: 'NEUTRAL',
      strength: 0.0,
      details: `Neutral in ${signInfo.sign}`,
      exactness: 0.5
    };
  }

  // Calculate Shadbala (Six-fold strength)
  calculateShadbala(planet, longitude, house, birthTime, currentTime) {
    let totalStrength = 0;
    const strengthComponents = {};

    // 1. Sthana Bala (Positional Strength)
    const dignity = this.calculatePlanetaryDignity(planet, longitude);
    const sthana_bala = Math.max(0, dignity.strength + 1) * 20; // Convert to 0-40 scale
    strengthComponents.sthana_bala = sthana_bala;
    totalStrength += sthana_bala;

    // 2. Dig Bala (Directional Strength)
    const strongestHouse = this.directionalStrength[planet];
    const houseDiff = Math.abs(house - strongestHouse);
    const adjustedDiff = Math.min(houseDiff, 12 - houseDiff); // Circular distance
    const dig_bala = Math.max(0, 20 - (adjustedDiff * 3)); // 0-20 scale
    strengthComponents.dig_bala = dig_bala;
    totalStrength += dig_bala;

    // 3. Kala Bala (Temporal Strength) - simplified
    const hour = new Date(currentTime).getHours();
    const isDay = hour >= 6 && hour < 18;
    let kala_bala = 10; // Base strength
    
    // Day/Night strength variations
    if (['SUN', 'JUPITER', 'VENUS'].includes(planet) && isDay) {
      kala_bala += 5;
    } else if (['MOON', 'MARS', 'SATURN'].includes(planet) && !isDay) {
      kala_bala += 5;
    }
    
    strengthComponents.kala_bala = kala_bala;
    totalStrength += kala_bala;

    // 4. Chesta Bala (Motional Strength) - simplified
    // This would require orbital mechanics calculations
    const chesta_bala = 10; // Placeholder
    strengthComponents.chesta_bala = chesta_bala;
    totalStrength += chesta_bala;

    // 5. Naisargika Bala (Natural Strength)
    const naisargika_values = {
      SUN: 30, MOON: 51.43, MARS: 17.14, MERCURY: 25.71,
      JUPITER: 34.28, VENUS: 42.85, SATURN: 8.57
    };
    const naisargika_bala = naisargika_values[planet] || 15;
    strengthComponents.naisargika_bala = naisargika_bala;
    totalStrength += naisargika_bala;

    // 6. Drik Bala (Aspectual Strength) - simplified
    const drik_bala = 10; // Would need aspect calculations
    strengthComponents.drik_bala = drik_bala;
    totalStrength += drik_bala;

    return {
      total_strength: totalStrength,
      components: strengthComponents,
      normalized_strength: Math.min(1.0, totalStrength / 200), // Normalize to 0-1
      grade: this.getStrengthGrade(totalStrength)
    };
  }

  // Get strength grade
  getStrengthGrade(totalStrength) {
    if (totalStrength >= 180) return 'EXCEPTIONAL';
    if (totalStrength >= 150) return 'VERY_STRONG';
    if (totalStrength >= 120) return 'STRONG';
    if (totalStrength >= 90) return 'MODERATE';
    if (totalStrength >= 60) return 'WEAK';
    return 'VERY_WEAK';
  }

  // Calculate spiritual strength based on dignity and nakshatra
  calculateSpiritualStrength(planet, longitude, nakshatraData) {
    const dignity = this.calculatePlanetaryDignity(planet, longitude);
    let spiritualStrength = 0.5; // Base spiritual strength

    // Dignity influence on spiritual strength
    switch (dignity.status) {
      case 'EXALTATION':
        spiritualStrength += 0.4 * dignity.exactness;
        break;
      case 'MOOL_TRIKONA':
        spiritualStrength += 0.3;
        break;
      case 'OWN_SIGN':
        spiritualStrength += 0.2;
        break;
      case 'DEBILITATION':
        spiritualStrength -= 0.3 * dignity.exactness;
        break;
    }

    // Nakshatra influence
    if (nakshatraData) {
      const nakshatraSpiritual = {
        'Deva': 0.3,
        'Manushya': 0.1,
        'Rakshasa': -0.1
      }[nakshatraData.gana] || 0;
      
      spiritualStrength += nakshatraSpiritual;

      // Special spiritual nakshatras boost
      const spiritualNakshatras = [
        'Pushya', 'Ashlesha', 'Magha', 'Uttara Bhadrapada', 
        'Purva Bhadrapada', 'Shatabhisha', 'Revati'
      ];
      
      if (spiritualNakshatras.includes(nakshatraData.name)) {
        spiritualStrength += 0.2;
      }
    }

    // Planet-specific spiritual modifications
    const planetSpiritualNature = {
      JUPITER: 0.3,  // Most spiritual planet
      MOON: 0.2,     // Consciousness and intuition
      VENUS: 0.1,    // Divine love and beauty
      MERCURY: 0.1,  // Spiritual knowledge
      SUN: 0.1,      // Soul and self-realization
      SATURN: 0.2,   // Spiritual discipline (when well-placed)
      MARS: 0.0,     // Spiritual warrior (neutral)
      KETU: 0.4,     // Moksha karaka
      RAHU: -0.1     // Material desires (but can give occult knowledge)
    };

    spiritualStrength += planetSpiritualNature[planet] || 0;

    return Math.max(0, Math.min(1, spiritualStrength));
  }

  // Calculate planetary friendship influence
  calculateFriendshipInfluence(planet1, planet2, longitude1, longitude2) {
    const dignity1 = this.planetaryDignities[planet1];
    const dignity2 = this.planetaryDignities[planet2];
    
    if (!dignity1 || !dignity2) return 0;

    let influence = 0;

    // Basic friendship/enmity
    if (dignity1.friends.includes(planet2)) {
      influence += 0.3;
    } else if (dignity1.enemies.includes(planet2)) {
      influence -= 0.3;
    }

    // Temporary friendship based on positions (simplified)
    const sign1 = this.getSignFromLongitude(longitude1);
    const sign2 = this.getSignFromLongitude(longitude2);
    
    const signDiff = Math.abs(sign1.signIndex - sign2.signIndex);
    const adjustedDiff = Math.min(signDiff, 12 - signDiff);
    
    // Planets in same sign or opposite signs create strong influence
    if (adjustedDiff === 0) {
      influence += 0.2; // Conjunction influence
    } else if (adjustedDiff === 6) {
      influence += 0.1; // Opposition influence
    } else if ([3, 9].includes(adjustedDiff)) {
      influence += 0.15; // Trine influence
    } else if ([4, 8].includes(adjustedDiff)) {
      influence += 0.1; // Square influence
    }

    return Math.max(-1, Math.min(1, influence));
  }

  // Calculate overall planetary strength for prediction
  calculateOverallPlanetaryStrength(planetaryPositions, nakshatraData = {}) {
    const planetStrengths = {};
    const planetInteractions = {};

    // Calculate individual planet strengths
    for (const [planet, position] of Object.entries(planetaryPositions)) {
      if (!position || typeof position.longitude !== 'number') continue;

      const dignity = this.calculatePlanetaryDignity(planet, position.longitude);
      const shadbala = this.calculateShadbala(
        planet, 
        position.longitude, 
        position.house || 1, 
        new Date(), 
        new Date()
      );
      
      const nakshatPlanetData = nakshatraData[planet];
      const spiritualStrength = this.calculateSpiritualStrength(
        planet, 
        position.longitude, 
        nakshatPlanetData
      );

      planetStrengths[planet] = {
        dignity: dignity,
        shadbala: shadbala,
        spiritual_strength: spiritualStrength,
        overall_strength: (
          (dignity.strength + 1) * 0.3 + 
          shadbala.normalized_strength * 0.4 + 
          spiritualStrength * 0.3
        )
      };
    }

    // Calculate planet interactions
    const planets = Object.keys(planetStrengths);
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        const pos1 = planetaryPositions[planet1];
        const pos2 = planetaryPositions[planet2];
        
        if (pos1 && pos2) {
          const influence = this.calculateFriendshipInfluence(
            planet1, planet2, pos1.longitude, pos2.longitude
          );
          
          planetInteractions[`${planet1}-${planet2}`] = {
            influence: influence,
            description: this.getInteractionDescription(planet1, planet2, influence)
          };
        }
      }
    }

    return {
      individual_strengths: planetStrengths,
      interactions: planetInteractions,
      overall_chart_strength: this.calculateChartStrength(planetStrengths)
    };
  }

  // Calculate overall chart strength
  calculateChartStrength(planetStrengths) {
    const planets = Object.keys(planetStrengths);
    let totalStrength = 0;
    let beneficStrength = 0;
    let maleficStrength = 0;

    const benefics = ['JUPITER', 'VENUS', 'MERCURY', 'MOON'];
    const malefics = ['SATURN', 'MARS', 'SUN'];

    for (const planet of planets) {
      const strength = planetStrengths[planet].overall_strength;
      totalStrength += strength;
      
      if (benefics.includes(planet)) {
        beneficStrength += strength;
      } else if (malefics.includes(planet)) {
        maleficStrength += strength;
      }
    }

    return {
      average_strength: totalStrength / planets.length,
      benefic_strength: beneficStrength / benefics.filter(p => planets.includes(p)).length,
      malefic_strength: maleficStrength / malefics.filter(p => planets.includes(p)).length,
      balance_ratio: beneficStrength / (maleficStrength + 0.1), // Avoid division by zero
      chart_grade: this.getChartGrade(totalStrength / planets.length)
    };
  }

  // Get chart grade
  getChartGrade(averageStrength) {
    if (averageStrength >= 0.8) return 'EXCEPTIONAL';
    if (averageStrength >= 0.7) return 'VERY_STRONG';
    if (averageStrength >= 0.6) return 'STRONG';
    if (averageStrength >= 0.5) return 'MODERATE';
    if (averageStrength >= 0.4) return 'WEAK';
    return 'CHALLENGING';
  }

  // Get interaction description
  getInteractionDescription(planet1, planet2, influence) {
    const absInfluence = Math.abs(influence);
    let intensity = 'moderate';
    
    if (absInfluence >= 0.4) intensity = 'very strong';
    else if (absInfluence >= 0.3) intensity = 'strong';
    else if (absInfluence >= 0.2) intensity = 'moderate';
    else intensity = 'mild';

    const type = influence > 0 ? 'harmonious' : 'challenging';
    
    return `${intensity} ${type} interaction between ${planet1} and ${planet2}`;
  }
}

module.exports = PlanetaryStrengthCalculator;
