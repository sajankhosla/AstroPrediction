/**
 * Vercel-Compatible Local AI Service for Astrological Insights
 * Uses lightweight text processing and rule-based AI for positive insights
 * No external API dependencies - runs entirely on Vercel serverless functions
 */

class VercelAIService {
  constructor() {
    // Enhanced templates for astrological insights
    this.insightTemplates = {
      summary: {
        high_positivity: [
          "Your cosmic blueprint with {chartSignature} reveals exceptional alignment for manifesting your highest potential. With {moonNakshatra} moon providing {spiritualTheme}, you're entering a golden period of {positivityLevel} cosmic support.",
          "{name}, your unique planetary arrangement {chartSignature} creates a powerful foundation for transformation. Your {moonNakshatra} moon nakshatra brings {spiritualTheme} energy, perfectly timed with current {positivityLevel} influences.",
          "The universe has blessed you with a remarkable {chartSignature} configuration. Your {moonNakshatra} lunar placement channels {spiritualTheme} wisdom, amplified by {positivityLevel} cosmic timing."
        ],
        medium_positivity: [
          "Your cosmic blueprint {chartSignature} indicates a balanced period of growth and learning. With {moonNakshatra} moon guiding your {spiritualTheme} journey, you're building sustainable foundations during this {positivityLevel} phase.",
          "{name}, your planetary signature {chartSignature} reveals steady progress ahead. Your {moonNakshatra} nakshatra provides {spiritualTheme} stability, supporting measured advancement in this {positivityLevel} period.",
          "Your unique {chartSignature} pattern suggests thoughtful evolution. The {moonNakshatra} moon brings {spiritualTheme} perspective, helping you navigate this {positivityLevel} transformative time."
        ],
        transformative: [
          "Your powerful {chartSignature} configuration signals deep transformation ahead. With {moonNakshatra} moon as your spiritual anchor, you're developing {spiritualTheme} mastery through this {positivityLevel} growth period.",
          "{name}, your cosmic signature {chartSignature} indicates profound inner development. Your {moonNakshatra} nakshatra channels {spiritualTheme} strength, preparing you for breakthrough in this {positivityLevel} phase.",
          "The cosmos has designed your {chartSignature} blueprint for spiritual evolution. Your {moonNakshatra} moon provides {spiritualTheme} resilience, perfect for navigating this {positivityLevel} transformation."
        ]
      },
      strengths: {
        JUPITER: [
          "Exceptional wisdom through {nakshatra} nakshatra creates natural teaching and counseling abilities",
          "Your Jupiter in {nakshatra} brings profound spiritual insights and the gift of inspiring others",
          "Sacred knowledge flows through your Jupiter-{nakshatra} combination, making you a natural guide"
        ],
        VENUS: [
          "Creative brilliance in {nakshatra} manifests as artistic talents and aesthetic sensitivity",
          "Your Venus-{nakshatra} placement brings harmony to relationships and beauty to everything you touch",
          "Artistic gifts through {nakshatra} create opportunities for creative and financial prosperity"
        ],
        MOON: [
          "Deep intuitive wisdom through {nakshatra} provides exceptional emotional intelligence",
          "Your Moon in {nakshatra} grants profound psychic abilities and healing presence",
          "Emotional mastery via {nakshatra} makes you a natural counselor and nurturer"
        ],
        MERCURY: [
          "Sharp intellect in {nakshatra} creates outstanding communication and analytical skills",
          "Your Mercury-{nakshatra} combination brings genius-level learning abilities",
          "Mental agility through {nakshatra} opens doors in technology, writing, and teaching"
        ],
        SUN: [
          "Radiant leadership through {nakshatra} indicates natural authority and charisma",
          "Your Sun in {nakshatra} brings magnetic personality and leadership capabilities",
          "Solar energy in {nakshatra} creates opportunities for recognition and authority"
        ],
        MARS: [
          "Dynamic courage through {nakshatra} provides exceptional energy and determination",
          "Your Mars-{nakshatra} placement brings athletic abilities and competitive edge",
          "Warrior energy in {nakshatra} grants courage to overcome any obstacle"
        ],
        SATURN: [
          "Disciplined mastery through {nakshatra} provides exceptional organizational skills",
          "Your Saturn in {nakshatra} brings patience and ability to build lasting achievements",
          "Structured wisdom via {nakshatra} creates opportunities for long-term success"
        ]
      },
      spiritual_practices: {
        primary: [
          "Daily meditation with {deity} mantras amplifies your {nakshatra} moon energy",
          "Sunrise prayers to {deity} enhance your spiritual connection through {nakshatra}",
          "Evening contemplation on {symbol} brings peace and clarity to your {nakshatra} nature"
        ],
        secondary: [
          "Weekly fasting on {favorableDay} honors your {nakshatra} spiritual path",
          "Monthly {gemstone} meditation strengthens your cosmic alignment",
          "Seasonal {ritual} ceremonies deepen your connection to {nakshatra} wisdom"
        ]
      },
      career_guidance: [
        "Your {strongPlanet} in {nakshatra} naturally supports careers in {careerField}",
        "The {strongPlanet}-{nakshatra} combination creates exceptional potential for {careerField}",
        "Professional success awaits in {careerField} thanks to your {strongPlanet} in {nakshatra}"
      ],
      timing_guidance: {
        excellent: [
          "This golden period with {positivityScore} energy is perfect for major life decisions and new ventures",
          "Exceptional cosmic timing with {positivityScore} support - launch important projects now",
          "Peak favorable energy at {positivityScore} - the universe fully supports your ambitions"
        ],
        good: [
          "Balanced cosmic influences at {positivityScore} favor steady progress and careful planning",
          "Moderate energy at {positivityScore} supports consistent effort and foundation building",
          "Stable timing with {positivityScore} energy - focus on sustainable growth"
        ],
        challenging: [
          "Transformative period at {positivityScore} builds exceptional inner strength and wisdom",
          "Intense energy at {positivityScore} creates opportunities for profound personal growth",
          "Deep learning phase with {positivityScore} energy - trust your inner transformation"
        ]
      }
    };

    // Nakshatra spiritual themes
    this.nakshatraThemes = {
      'Ashwini': 'healing and new beginnings',
      'Bharani': 'transformation and creativity',
      'Krittika': 'purification and leadership',
      'Rohini': 'growth and material prosperity',
      'Mrigashirsha': 'seeking and exploration',
      'Ardra': 'storm and renewal',
      'Punarvasu': 'renewal and optimism',
      'Pushya': 'nourishment and protection',
      'Ashlesha': 'wisdom and mysticism',
      'Magha': 'authority and ancestral power',
      'Purva Phalguni': 'pleasure and relationships',
      'Uttara Phalguni': 'service and generosity',
      'Hasta': 'skill and dexterity',
      'Chitra': 'beauty and craftsmanship',
      'Swati': 'independence and flexibility',
      'Vishakha': 'determination and goal achievement',
      'Anuradha': 'friendship and devotion',
      'Jyeshtha': 'protection and seniority',
      'Mula': 'foundation and investigation',
      'Purva Ashadha': 'invincibility and pride',
      'Uttara Ashadha': 'victory and leadership',
      'Shravana': 'listening and learning',
      'Dhanishta': 'prosperity and rhythm',
      'Shatabhisha': 'healing and mysticism',
      'Purva Bhadrapada': 'passion and transformation',
      'Uttara Bhadrapada': 'depth and spiritual wisdom',
      'Revati': 'completion and transcendence'
    };

    // Career alignments by nakshatra
    this.nakshatraCareers = {
      'Ashwini': ['healing', 'medicine', 'emergency services', 'pioneering ventures'],
      'Bharani': ['arts', 'entertainment', 'fertility/birth services', 'agriculture'],
      'Krittika': ['leadership', 'military', 'cutting-edge technology', 'criticism/review'],
      'Rohini': ['agriculture', 'real estate', 'beauty industry', 'luxury goods'],
      'Mrigashirsha': ['research', 'exploration', 'travel', 'investigation'],
      'Ardra': ['technology', 'weather services', 'crisis management', 'transformation coaching'],
      'Punarvasu': ['teaching', 'counseling', 'restoration services', 'hospitality'],
      'Pushya': ['nutrition', 'childcare', 'education', 'protective services'],
      'Ashlesha': ['psychology', 'occult sciences', 'espionage', 'deep research'],
      'Magha': ['government', 'royalty services', 'heritage preservation', 'leadership roles'],
      'Purva Phalguni': ['entertainment', 'hospitality', 'luxury services', 'relationship counseling'],
      'Uttara Phalguni': ['social work', 'charitable organizations', 'public service', 'partnerships'],
      'Hasta': ['handicrafts', 'surgery', 'detailed work', 'manual skills'],
      'Chitra': ['architecture', 'design', 'photography', 'gemology'],
      'Swati': ['aviation', 'trade', 'diplomacy', 'flexible businesses'],
      'Vishakha': ['goal-oriented businesses', 'competitive fields', 'achievement coaching'],
      'Anuradha': ['networking', 'community building', 'loyalty programs', 'friendship services'],
      'Jyeshtha': ['senior management', 'protection services', 'elderly care', 'authority positions'],
      'Mula': ['research', 'foundational work', 'investigation', 'root cause analysis'],
      'Purva Ashadha': ['motivational speaking', 'competitive fields', 'victory-oriented businesses'],
      'Uttara Ashadha': ['final victory services', 'completion projects', 'ultimate goal achievement'],
      'Shravana': ['education', 'communication', 'media', 'listening-based services'],
      'Dhanishta': ['music', 'rhythm-based arts', 'wealth management', 'prosperity services'],
      'Shatabhisha': ['healing', 'alternative medicine', 'astronomy', 'unique solutions'],
      'Purva Bhadrapada': ['transformation services', 'intense healing', 'passionate pursuits'],
      'Uttara Bhadrapada': ['deep spiritual work', 'wisdom teaching', 'depth psychology'],
      'Revati': ['completion services', 'spiritual guidance', 'transcendental practices']
    };
  }

  async generatePositiveInsights(astrologyData) {
    try {
      // Process the astrological data using our rule-based AI
      const insights = this.processAstrologicalData(astrologyData);
      return insights;
    } catch (error) {
      console.error('Vercel AI Service Error:', error);
      return this.generateFallbackInsights(astrologyData);
    }
  }

  processAstrologicalData(astrologyData) {
    const {
      planetaryPositions = {},
      spiritualProfile = {},
      positivityScore = 0,
      dasha = 'Unknown',
      userInfo = {},
      classicalInsights = {}
    } = astrologyData;

    // Generate chart signature for uniqueness
    const chartSignature = this.generateChartSignature(planetaryPositions, spiritualProfile);
    
    // Determine positivity level
    const positivityLevel = this.getPositivityLevel(positivityScore);
    
    // Get moon nakshatra information
    const moonNakshatra = spiritualProfile.birth_moon_nakshatra?.name || 'unique placement';
    const spiritualTheme = this.nakshatraThemes[moonNakshatra] || 'spiritual growth';
    
    // Analyze strongest planets
    const strongestPlanets = this.findStrongestPlanets(planetaryPositions);
    
    // Generate personalized summary
    const summary = this.generatePersonalizedSummary({
      chartSignature,
      positivityLevel,
      moonNakshatra,
      spiritualTheme,
      name: userInfo.name,
      positivityScore
    });

    // Generate unique strengths
    const strengths = this.generatePersonalizedStrengths(strongestPlanets, planetaryPositions);
    
    // Generate opportunities
    const opportunities = this.generateOpportunities(positivityScore, spiritualProfile, classicalInsights);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      moonNakshatra,
      strongestPlanets,
      planetaryPositions,
      spiritualProfile
    );
    
    // Generate timing guidance
    const timingGuidance = this.generateTimingGuidance(positivityScore, dasha);
    
    // Generate encouragement
    const encouragement = this.generateEncouragement(chartSignature, moonNakshatra, spiritualTheme);

    return {
      summary,
      strengths,
      opportunities,
      recommendations,
      timing_guidance: timingGuidance,
      encouragement
    };
  }

  generateChartSignature(planetaryPositions, spiritualProfile) {
    const signatures = [];
    
    // Add strongest planetary placements
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && data.spiritual_strength > 0.7 && data.nakshatra) {
        signatures.push(`${planet}-${data.nakshatra.name}`);
      }
    }
    
    // Add moon nakshatra
    if (spiritualProfile.birth_moon_nakshatra) {
      signatures.push(`Moon-${spiritualProfile.birth_moon_nakshatra.name}`);
    }
    
    // Add strength level
    const strengthLevel = spiritualProfile.overall_spiritual_strength || 0;
    signatures.push(`Power-${Math.round(strengthLevel * 100)}`);
    
    return signatures.slice(0, 4).join('|') || 'UniqueBlueprint';
  }

  getPositivityLevel(score) {
    if (score > 0.6) return 'exceptional';
    if (score > 0.3) return 'balanced';
    if (score > 0) return 'moderate';
    return 'transformative';
  }

  findStrongestPlanets(planetaryPositions) {
    const planets = [];
    
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && typeof data === 'object' && data.spiritual_strength > 0.6) {
        planets.push({
          planet,
          strength: data.spiritual_strength,
          nakshatra: data.nakshatra?.name,
          dignity: data.dignity?.status
        });
      }
    }
    
    return planets.sort((a, b) => b.strength - a.strength).slice(0, 3);
  }

  generatePersonalizedSummary({ chartSignature, positivityLevel, moonNakshatra, spiritualTheme, name, positivityScore }) {
    const templates = this.insightTemplates.summary[positivityLevel === 'exceptional' ? 'high_positivity' : 
                                                     positivityLevel === 'transformative' ? 'transformative' : 'medium_positivity'];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return template
      .replace('{chartSignature}', chartSignature)
      .replace('{moonNakshatra}', moonNakshatra)
      .replace('{spiritualTheme}', spiritualTheme)
      .replace('{positivityLevel}', positivityLevel)
      .replace('{name}', name || 'Your unique cosmic blueprint')
      .replace('{positivityScore}', positivityScore.toFixed(3));
  }

  generatePersonalizedStrengths(strongestPlanets, planetaryPositions) {
    const strengths = [];
    
    // Add strengths from strongest planets
    strongestPlanets.forEach(({ planet, nakshatra }) => {
      if (this.insightTemplates.strengths[planet] && nakshatra) {
        const templates = this.insightTemplates.strengths[planet];
        const template = templates[Math.floor(Math.random() * templates.length)];
        strengths.push(template.replace('{nakshatra}', nakshatra));
      }
    });
    
    // Add exalted planet strengths
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && data.dignity?.status === 'EXALTATION' && data.nakshatra) {
        strengths.push(`Exalted ${planet} in ${data.nakshatra.name} creates exceptional cosmic power and rare opportunities`);
      }
    }
    
    return strengths.length > 0 ? strengths : ['Unique planetary combination creates special talents and adaptive abilities'];
  }

  generateOpportunities(positivityScore, spiritualProfile, classicalInsights) {
    const opportunities = [];
    
    // Timing-based opportunities
    if (positivityScore > 0.6) {
      opportunities.push('Exceptional cosmic timing creates golden opportunities for major achievements and recognition');
    } else if (positivityScore > 0.2) {
      opportunities.push('Balanced cosmic influences support steady growth and sustainable success');
    } else {
      opportunities.push('Transformative period builds exceptional resilience and unlocks hidden potential');
    }
    
    // Spiritual gifts as opportunities
    if (spiritualProfile.spiritual_gifts) {
      spiritualProfile.spiritual_gifts.forEach(gift => {
        opportunities.push(`Your natural ${gift.toLowerCase()} opens doors to unique opportunities and meaningful connections`);
      });
    }
    
    // Classical yoga opportunities
    if (classicalInsights.detectedYogas && classicalInsights.detectedYogas.length > 0) {
      opportunities.push(`Special yogas in your chart create rare opportunities for success and spiritual advancement`);
    }
    
    return opportunities;
  }

  generateRecommendations(moonNakshatra, strongestPlanets, planetaryPositions, spiritualProfile) {
    const recommendations = {
      spiritual_practices: [],
      daily_life: [],
      relationships: [],
      career: []
    };
    
    // Spiritual practices based on moon nakshatra
    if (moonNakshatra && spiritualProfile.birth_moon_nakshatra) {
      const nakshatra = spiritualProfile.birth_moon_nakshatra;
      recommendations.spiritual_practices.push(
        `Daily meditation with ${nakshatra.deity} mantras amplifies your ${moonNakshatra} lunar energy`,
        `Weekly contemplation on ${nakshatra.symbol} brings clarity and spiritual insight`
      );
    }
    
    // Career recommendations from strongest planets
    strongestPlanets.forEach(({ planet, nakshatra }) => {
      if (nakshatra && this.nakshatraCareers[nakshatra]) {
        const careers = this.nakshatraCareers[nakshatra];
        recommendations.career.push(`Your ${planet} in ${nakshatra} naturally supports careers in ${careers.slice(0, 2).join(' or ')}`);
      }
    });
    
    // Daily life recommendations
    recommendations.daily_life.push(
      'Align major decisions with your strongest planetary days for maximum success',
      'Honor your unique cosmic timing by trusting your intuitive guidance'
    );
    
    // Relationship recommendations
    if (spiritualProfile.birth_moon_nakshatra) {
      const spiritualTheme = this.nakshatraThemes[spiritualProfile.birth_moon_nakshatra.name] || 'emotional wisdom';
      recommendations.relationships.push(
        `Your ${spiritualProfile.birth_moon_nakshatra.name} nature brings ${spiritualTheme} to all relationships`,
        'Practice patience and understanding aligned with your spiritual gifts'
      );
    }
    
    return recommendations;
  }

  generateTimingGuidance(positivityScore, dasha) {
    const level = this.getPositivityLevel(positivityScore);
    const templates = this.insightTemplates.timing_guidance[level === 'exceptional' ? 'excellent' : 
                                                            level === 'transformative' ? 'challenging' : 'good'];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace('{positivityScore}', positivityScore.toFixed(3));
  }

  generateEncouragement(chartSignature, moonNakshatra, spiritualTheme) {
    return `Your cosmic blueprint ${chartSignature} is absolutely unique in this universe. No one else shares your exact planetary arrangement, making your purpose irreplaceable in the cosmic plan. Your ${moonNakshatra} moon grants you special access to ${spiritualTheme} wisdom. Trust in your individual journey - the stars have aligned perfectly to support your highest evolution.`;
  }

  generateFallbackInsights(astrologyData) {
    return {
      summary: "Your unique cosmic blueprint reveals special talents and opportunities for growth, perfectly designed for your spiritual journey.",
      strengths: ["Resilient spirit and adaptive nature", "Unique perspective that brings value to others"],
      opportunities: ["Current cosmic timing supports personal development", "Universal energies favor authentic self-expression"],
      recommendations: {
        spiritual_practices: ["Daily meditation aligned with your inner wisdom", "Regular gratitude practice"],
        daily_life: ["Trust your intuitive guidance", "Align actions with your highest values"],
        relationships: ["Practice compassion and understanding", "Share your unique gifts with others"],
        career: ["Seek opportunities that honor your authentic nature", "Develop your natural talents"]
      },
      timing_guidance: "The universe supports your growth and evolution. Trust in divine timing.",
      encouragement: "You are exactly where you need to be on your cosmic journey. Your unique gifts are needed in this world."
    };
  }

  // Method to enhance existing predictions with insights
  async enhancePredictionWithInsights(predictionData) {
    try {
      const insights = await this.generatePositiveInsights(predictionData);
      
      return {
        ...predictionData,
        positiveInsights: insights,
        enhancedGuidance: this.createEnhancedGuidance(predictionData, insights)
      };
      
    } catch (error) {
      console.error('Error enhancing prediction:', error);
      return {
        ...predictionData,
        positiveInsights: this.generateFallbackInsights(predictionData),
        enhancedGuidance: 'Enhanced guidance generated using local AI processing'
      };
    }
  }

  createEnhancedGuidance(predictionData, insights) {
    const guidance = [];
    
    if (predictionData.positivityScore > 0.5) {
      guidance.push('🌟 Excellent cosmic timing for manifestation and achievement');
    } else if (predictionData.positivityScore > 0) {
      guidance.push('⚖️ Balanced energies support steady progress and learning');
    } else {
      guidance.push('🔮 Transformative period builds inner strength and wisdom');
    }
    
    if (insights.timing_guidance) {
      guidance.push(`✨ ${insights.timing_guidance}`);
    }
    
    return guidance.join('\n\n');
  }
}

module.exports = VercelAIService;
