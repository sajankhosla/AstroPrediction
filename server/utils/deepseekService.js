/**
 * DeepSeek-R1 Integration Service for Positive Astrological Insights
 * Converts technical astrological data into meaningful, positive guidance
 */

const axios = require('axios');

class DeepSeekService {
  constructor() {
    // Use a hosted DeepSeek API endpoint (replace with actual hosted service)
    this.apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    this.apiKey = process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key';
    
    this.systemPrompt = `You are a wise and compassionate Vedic astrology counselor who transforms complex astrological data into positive, actionable insights. Your role is to:

1. **Always focus on the positive aspects** and opportunities for growth
2. **Provide practical guidance** that empowers the person
3. **Explain complex astrological concepts** in simple, relatable terms
4. **Offer specific recommendations** for personal development
5. **Maintain an encouraging and supportive tone** throughout

When analyzing planetary positions and nakshatras:
- Highlight strengths and natural talents
- Frame challenges as growth opportunities
- Suggest practical steps for improvement
- Connect ancient wisdom to modern life
- Emphasize free will and personal agency

Always structure your response as JSON with these sections:
{
  "summary": "Brief positive overview of the person's cosmic blueprint",
  "strengths": ["List of key strengths and talents"],
  "opportunities": ["Growth areas framed positively"],
  "recommendations": {
    "spiritual_practices": ["Specific practices based on birth nakshatra"],
    "daily_life": ["Practical daily recommendations"],
    "relationships": ["Guidance for harmonious connections"],
    "career": ["Professional development suggestions"]
  },
  "timing_guidance": "Advice about current cosmic timing and upcoming opportunities",
  "encouragement": "Uplifting message about their unique cosmic purpose"
}`;
  }

  async generatePositiveInsights(astrologyData) {
    try {
      const promptContent = this.createPrompt(astrologyData);
      
      const response = await axios.post(this.apiUrl, {
        model: "deepseek-reasoner",
        messages: [
          {
            role: "system",
            content: this.systemPrompt
          },
          {
            role: "user",
            content: promptContent
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data && response.data.choices && response.data.choices[0]) {
        const content = response.data.choices[0].message.content;
        return JSON.parse(content);
      } else {
        throw new Error('Invalid response from DeepSeek API');
      }
      
    } catch (error) {
      console.error('DeepSeek API Error:', error.message);
      
      // Fallback to local positive insights generation
      return this.generateFallbackInsights(astrologyData);
    }
  }

  createPrompt(astrologyData) {
    const {
      planetaryPositions = {},
      spiritualProfile = {},
      positivityScore = 0,
      dasha = 'Unknown',
      classicalInsights = {},
      aspects = [],
      userInfo = {}
    } = astrologyData;

    // Create unique identifiers for personalization
    const chartSignature = this.generateChartSignature(planetaryPositions, spiritualProfile);
    
    let prompt = `Analyze this UNIQUE individual's Vedic astrology chart with their specific planetary combinations. Focus on what makes THIS person special and different:

**UNIQUE CHART SIGNATURE:** ${chartSignature}

**Personal Details:**
${userInfo.name ? `- Name: ${userInfo.name}` : '- Individual chart analysis'}
${userInfo.birthPlace ? `- Birth Location: ${userInfo.birthPlace}` : ''}
- Positivity Score: ${positivityScore.toFixed(3)} (very specific to current timing)
- Current Dasha: ${dasha}
- Spiritual Strength: ${(spiritualProfile.overall_spiritual_strength || 0).toFixed(2)}/1.0

**SPECIFIC PLANETARY PLACEMENTS:**\n`;

    // Add detailed planetary analysis with unique combinations
    const planetOrder = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'RAHU', 'KETU'];
    
    for (const planet of planetOrder) {
      const data = planetaryPositions[planet];
      if (data && typeof data === 'object' && data.nakshatra) {
        prompt += `\n**${planet}** [Longitude: ${data.longitude?.toFixed(2)}°]:\n`;
        prompt += `  • Nakshatra: ${data.nakshatra.name} (${data.nakshatra.pada}/4 pada)\n`;
        prompt += `  • House: ${data.house} | Dignity: ${data.dignity?.status || 'Neutral'}\n`;
        prompt += `  • Spiritual Strength: ${(data.spiritual_strength || 0).toFixed(2)}/1.0\n`;
        prompt += `  • Deity: ${data.nakshatra.deity} | Symbol: ${data.nakshatra.symbol}\n`;
        prompt += `  • Key Theme: ${data.nakshatra.spiritual_significance}\n`;
        
        if (data.nakshatra.career_inclinations) {
          prompt += `  • Career Gifts: ${data.nakshatra.career_inclinations.join(', ')}\n`;
        }
      }
    }

    // Add unique spiritual profile
    if (spiritualProfile.birth_moon_nakshatra) {
      prompt += `\n**MOON NAKSHATRA PROFILE:**\n`;
      prompt += `- Primary Nakshatra: ${spiritualProfile.birth_moon_nakshatra.name}\n`;
      prompt += `- Spiritual Path: ${spiritualProfile.spiritual_path || 'Self-discovery journey'}\n`;
      prompt += `- Life Theme: ${spiritualProfile.birth_moon_nakshatra.spiritual_significance}\n`;
    }

    // Add specific planetary combinations that create uniqueness
    const uniqueCombinations = this.analyzeUniqueCombinations(planetaryPositions);
    if (uniqueCombinations.length > 0) {
      prompt += `\n**UNIQUE PLANETARY COMBINATIONS:**\n`;
      uniqueCombinations.forEach(combo => {
        prompt += `- ${combo}\n`;
      });
    }

    // Add individual spiritual gifts and challenges
    if (spiritualProfile.spiritual_gifts && spiritualProfile.spiritual_gifts.length > 0) {
      prompt += `\n**PERSONAL SPIRITUAL GIFTS:**\n`;
      spiritualProfile.spiritual_gifts.forEach(gift => prompt += `- ${gift}\n`);
    }

    if (spiritualProfile.spiritual_challenges && spiritualProfile.spiritual_challenges.length > 0) {
      prompt += `\n**GROWTH OPPORTUNITIES:**\n`;
      spiritualProfile.spiritual_challenges.forEach(challenge => prompt += `- ${challenge}\n`);
    }

    // Add karmic path details
    if (spiritualProfile.karmic_indicators) {
      const karmic = spiritualProfile.karmic_indicators;
      prompt += `\n**KARMIC PATH:**\n`;
      if (karmic.rahu_position) {
        prompt += `- Rahu (Soul's Purpose): House ${karmic.rahu_position.house} - ${karmic.rahu_position.lesson}\n`;
      }
      if (karmic.ketu_position) {
        prompt += `- Ketu (Past Life Skills): House ${karmic.ketu_position.house} - ${karmic.ketu_position.lesson}\n`;
      }
    }

    // Add specific yogas and their effects
    if (classicalInsights.detectedYogas && classicalInsights.detectedYogas.length > 0) {
      prompt += `\n**SPECIAL YOGAS IN THIS CHART:**\n`;
      classicalInsights.detectedYogas.forEach(yoga => {
        prompt += `- ${yoga.name}: ${yoga.description || 'Brings special blessings'}\n`;
      });
    }

    prompt += `\n**ANALYSIS REQUEST:**
Create a highly personalized reading for this specific individual. Consider:
1. Their unique nakshatra combinations (especially ${spiritualProfile.birth_moon_nakshatra?.name || 'Moon placement'})
2. The specific planetary strengths and dignity placements
3. Their exact positivity score of ${positivityScore.toFixed(3)}
4. How their karmic indicators create a unique life path
5. Practical advice that matches their specific planetary combinations

Make this reading distinctly different from any other chart. Focus on what makes THIS person's cosmic blueprint special and how they can maximize their unique potential.`;

    return prompt;
  }

  // Helper method to generate unique chart signature
  generateChartSignature(planetaryPositions, spiritualProfile) {
    const signatures = [];
    
    // Create signature from strongest planets
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && data.spiritual_strength > 0.7) {
        signatures.push(`${planet}-${data.nakshatra?.name || 'Unknown'}`);
      }
    }
    
    // Add moon nakshatra signature
    if (spiritualProfile.birth_moon_nakshatra) {
      signatures.push(`Moon-${spiritualProfile.birth_moon_nakshatra.name}`);
    }
    
    // Add overall strength signature
    const strengthLevel = spiritualProfile.overall_spiritual_strength || 0;
    signatures.push(`Strength-${(strengthLevel * 100).toFixed(0)}`);
    
    return signatures.join('|') || 'Unique-Individual';
  }

  // Helper method to analyze unique planetary combinations
  analyzeUniqueCombinations(planetaryPositions) {
    const combinations = [];
    
    // Look for planets in same nakshatra
    const nakshatraGroups = {};
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && data.nakshatra) {
        if (!nakshatraGroups[data.nakshatra.name]) {
          nakshatraGroups[data.nakshatra.name] = [];
        }
        nakshatraGroups[data.nakshatra.name].push(planet);
      }
    }
    
    for (const [nakshatra, planets] of Object.entries(nakshatraGroups)) {
      if (planets.length > 1) {
        combinations.push(`${planets.join(' + ')} conjunction in ${nakshatra} creates unique energy blend`);
      }
    }
    
    // Look for exalted planets
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && data.dignity?.status === 'EXALTATION') {
        combinations.push(`${planet} exalted in ${data.nakshatra?.name} brings exceptional ${planet === 'JUPITER' ? 'wisdom' : planet === 'VENUS' ? 'creativity' : planet === 'MARS' ? 'courage' : 'strength'}`);
      }
    }
    
    // Look for strong spiritual planets
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && data.spiritual_strength > 0.8) {
        combinations.push(`Highly spiritual ${planet} in ${data.nakshatra?.name} indicates ${planet === 'MOON' ? 'deep intuitive gifts' : planet === 'JUPITER' ? 'natural teaching ability' : 'spiritual leadership potential'}`);
      }
    }
    
    return combinations;
  }

  generateFallbackInsights(astrologyData) {
    const {
      planetaryPositions = {},
      spiritualProfile = {},
      positivityScore = 0,
      dasha = 'Unknown',
      userInfo = {}
    } = astrologyData;

    // Generate highly personalized insights based on available data
    const strengths = [];
    const opportunities = [];
    const spiritualPractices = [];
    const dailyLife = [];
    const careerGuidance = [];
    const relationshipGuidance = [];

    // Create unique chart signature for personalization
    const chartSignature = this.generateChartSignature(planetaryPositions, spiritualProfile);
    
    // Detailed planetary strengths analysis
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && typeof data === 'object' && data.nakshatra) {
        const spiritualStrength = data.spiritual_strength || 0;
        const nakshatra = data.nakshatra;
        
        if (spiritualStrength > 0.6) {
          const planetDetails = {
            'JUPITER': {
              strength: `Exceptional wisdom through ${nakshatra.name} nakshatra brings teaching and counseling gifts`,
              career: `Natural mentor and guide - ${nakshatra.career_inclinations?.join(', ') || 'spiritual leadership'}`,
              practice: `Study of sacred texts and ${nakshatra.deity} mantras enhance Jupiter's blessings`
            },
            'VENUS': {
              strength: `Creative excellence in ${nakshatra.name} manifests as artistic and aesthetic talents`,
              career: `Arts, beauty, relationships - ${nakshatra.career_inclinations?.join(', ') || 'creative fields'}`,
              practice: `Beauty meditation and devotion to ${nakshatra.deity} amplify Venus energy`
            },
            'MOON': {
              strength: `Deep emotional wisdom through ${nakshatra.name} provides intuitive guidance abilities`,
              career: `Psychology, healing, nurturing professions align with your lunar gifts`,
              practice: `Moon-gazing meditation and ${nakshatra.deity} prayers strengthen intuition`
            },
            'MERCURY': {
              strength: `Sharp intellect in ${nakshatra.name} creates exceptional communication and analytical skills`,
              career: `Writing, teaching, technology - your Mercury excels in information fields`,
              practice: `Mantra recitation and study enhance Mercury's communicative powers`
            },
            'SUN': {
              strength: `Strong solar energy in ${nakshatra.name} indicates natural leadership and authority`,
              career: `Leadership roles, government, management suit your solar nature`,
              practice: `Surya mantras and dawn meditation amplify your inner authority`
            },
            'MARS': {
              strength: `Powerful Mars in ${nakshatra.name} brings courage, energy, and competitive edge`,
              career: `Sports, military, engineering, surgery - Mars-ruled professions favor you`,
              practice: `Physical exercise and ${nakshatra.deity} worship channel Mars energy positively`
            },
            'SATURN': {
              strength: `Disciplined Saturn in ${nakshatra.name} provides exceptional persistence and organizational skills`,
              career: `Long-term projects, administration, research suit your Saturn patience`,
              practice: `Regular spiritual discipline and service activities honor Saturn`
            }
          };
          
          if (planetDetails[planet]) {
            strengths.push(planetDetails[planet].strength);
            careerGuidance.push(planetDetails[planet].career);
            spiritualPractices.push(planetDetails[planet].practice);
          }
        }
        
        // Add nakshatra-specific insights
        if (data.dignity?.status === 'EXALTATION') {
          strengths.push(`Exalted ${planet} in ${nakshatra.name} is your cosmic superpower - exceptional ${planet.toLowerCase()} energy`);
          opportunities.push(`Your exalted ${planet} creates rare opportunities for mastery in ${planet.toLowerCase()}-related areas`);
        }
        
        if (data.dignity?.status === 'DEBILITATION') {
          opportunities.push(`${planet} in ${nakshatra.name} teaches humility and provides deep wisdom through challenges`);
          dailyLife.push(`Transform ${planet} challenges through ${nakshatra.spiritual_significance.toLowerCase()} practices`);
        }
      }
    }

    // Detailed moon nakshatra analysis
    if (spiritualProfile.birth_moon_nakshatra) {
      const nakshatra = spiritualProfile.birth_moon_nakshatra;
      spiritualPractices.push(`Primary spiritual practice: Daily connection with ${nakshatra.deity} through mantras and meditation`);
      spiritualPractices.push(`Moon nakshatra ${nakshatra.name} meditation: Focus on ${nakshatra.symbol} for inner peace`);
      dailyLife.push(`Live your ${nakshatra.name} nature: Embrace ${nakshatra.spiritual_significance.toLowerCase()}`);
      
      if (nakshatra.career_inclinations) {
        careerGuidance.push(`Your moon nakshatra ${nakshatra.name} naturally supports: ${nakshatra.career_inclinations.join(', ')}`);
      }
    }

    // Spiritual gifts and challenges analysis
    if (spiritualProfile.spiritual_gifts) {
      spiritualProfile.spiritual_gifts.forEach(gift => {
        strengths.push(`Unique spiritual gift: ${gift}`);
        spiritualPractices.push(`Develop your ${gift.toLowerCase()} through dedicated practice`);
      });
    }

    if (spiritualProfile.spiritual_challenges) {
      spiritualProfile.spiritual_challenges.forEach(challenge => {
        opportunities.push(`Growth opportunity: Transform ${challenge} into spiritual strength`);
        dailyLife.push(`Daily practice to overcome ${challenge.toLowerCase()}`);
      });
    }

    // Personalized timing based on exact positivity score
    const timingInsights = this.generateTimingInsights(positivityScore, dasha);
    opportunities.push(timingInsights.opportunity);
    dailyLife.push(timingInsights.dailyAction);

    // Karmic path insights
    if (spiritualProfile.karmic_indicators) {
      const karmic = spiritualProfile.karmic_indicators;
      if (karmic.rahu_position) {
        opportunities.push(`Rahu in house ${karmic.rahu_position.house}: ${karmic.rahu_position.lesson}`);
        careerGuidance.push(`Your life purpose involves mastering house ${karmic.rahu_position.house} themes`);
      }
      if (karmic.ketu_position) {
        strengths.push(`Ketu in house ${karmic.ketu_position.house}: You have natural wisdom in ${karmic.ketu_position.lesson}`);
        spiritualPractices.push(`Honor your past-life skills through ${karmic.ketu_position.lesson.toLowerCase()} activities`);
      }
    }

    // Generate personalized summary
    const personalizedSummary = this.generatePersonalizedSummary(chartSignature, spiritualProfile, positivityScore, userInfo);

    return {
      summary: personalizedSummary,
      strengths: strengths.length > 0 ? strengths : [`Unique ${chartSignature} combination creates special talents`, 'Resilient spirit adaptable to cosmic changes'],
      opportunities: opportunities.length > 0 ? opportunities : ['Universal cosmic support for personal growth'],
      recommendations: {
        spiritual_practices: spiritualPractices.length > 0 ? spiritualPractices : ['Personalized meditation based on your moon nakshatra', 'Daily gratitude practice'],
        daily_life: dailyLife.length > 0 ? dailyLife : ['Align daily actions with cosmic timing', 'Honor your unique planetary nature'],
        relationships: relationshipGuidance.length > 0 ? relationshipGuidance : [
          `Your ${spiritualProfile.birth_moon_nakshatra?.name || 'moon'} nature brings ${spiritualProfile.birth_moon_nakshatra?.spiritual_significance?.toLowerCase() || 'emotional wisdom'} to relationships`,
          'Practice compassion aligned with your spiritual gifts'
        ],
        career: careerGuidance.length > 0 ? careerGuidance : ['Align career with your strongest planetary energies', 'Seek roles that honor your spiritual path']
      },
      timing_guidance: `Your unique chart signature ${chartSignature} with positivity score ${positivityScore.toFixed(3)} indicates ${timingInsights.timing}. Current ${dasha} dasha ${timingInsights.dashaGuidance}.`,
      encouragement: `Your cosmic blueprint ${chartSignature} is absolutely unique in this universe. ${spiritualProfile.birth_moon_nakshatra ? `Your ${spiritualProfile.birth_moon_nakshatra.name} moon nakshatra gives you special access to ${spiritualProfile.birth_moon_nakshatra.spiritual_significance.toLowerCase()} wisdom.` : 'Your planetary combination creates special gifts.'} Trust in your individual cosmic purpose and remember - no one else has your exact planetary arrangement. This makes you irreplaceable in the cosmic plan.`
    };
  }

  // Helper method for timing insights
  generateTimingInsights(positivityScore, dasha) {
    if (positivityScore > 0.7) {
      return {
        opportunity: 'Exceptional cosmic timing - this is your golden period for major achievements',
        dailyAction: 'Take bold action and initiate important projects during this highly favorable time',
        timing: 'peak favorable energy',
        dashaGuidance: 'brings maximum benefits'
      };
    } else if (positivityScore > 0.4) {
      return {
        opportunity: 'Balanced cosmic influences offer steady progress and sustainable growth',
        dailyAction: 'Focus on consistent effort and building strong foundations',
        timing: 'balanced growth energy',
        dashaGuidance: 'supports steady advancement'
      };
    } else if (positivityScore > 0) {
      return {
        opportunity: 'Mixed cosmic energies teach important lessons while offering selective opportunities',
        dailyAction: 'Practice discernment and focus on inner development',
        timing: 'learning and preparation phase',
        dashaGuidance: 'provides valuable wisdom'
      };
    } else {
      return {
        opportunity: 'Intense transformative period builds exceptional inner strength and wisdom',
        dailyAction: 'Embrace spiritual practices and trust in your inner transformation',
        timing: 'deep transformation energy',
        dashaGuidance: 'catalyzes profound personal growth'
      };
    }
  }

  // Helper method for personalized summary
  generatePersonalizedSummary(chartSignature, spiritualProfile, positivityScore, userInfo) {
    const name = userInfo.name ? `${userInfo.name}, your` : 'Your';
    const moonNakshatra = spiritualProfile.birth_moon_nakshatra?.name || 'unique moon placement';
    const strengthLevel = (spiritualProfile.overall_spiritual_strength || 0).toFixed(2);
    
    return `${name} cosmic blueprint with signature ${chartSignature} reveals a truly unique soul journey. Your ${moonNakshatra} moon creates a special spiritual foundation with ${strengthLevel}/1.0 overall strength. With current timing score ${positivityScore.toFixed(3)}, your individual path is perfectly aligned for ${positivityScore > 0.5 ? 'manifesting your highest potential' : 'deep transformation and inner mastery'}. No other person shares your exact planetary arrangement - this makes your cosmic purpose irreplaceable.`;
  }

  // Method to enhance existing predictions with positive insights
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
        enhancedGuidance: 'Enhanced guidance temporarily unavailable'
      };
    }
  }

  createEnhancedGuidance(predictionData, insights) {
    const guidance = [];
    
    // Current timing guidance
    if (predictionData.positivityScore > 0.5) {
      guidance.push('🌟 Excellent cosmic timing for new ventures and important decisions');
    } else if (predictionData.positivityScore > 0) {
      guidance.push('⚖️ Balanced cosmic energies favor steady progress and careful planning');
    } else {
      guidance.push('🔮 Transformative period - focus on inner growth and preparation for future opportunities');
    }

    // Dasha-specific guidance
    if (predictionData.dasha) {
      const dashaGuidance = {
        'JUPITER': 'Jupiter period brings wisdom, growth, and spiritual advancement',
        'VENUS': 'Venus period enhances creativity, relationships, and material prosperity',
        'MOON': 'Moon period emphasizes intuition, emotions, and nurturing activities',
        'MERCURY': 'Mercury period favors communication, learning, and intellectual pursuits',
        'SUN': 'Sun period highlights leadership, authority, and self-expression',
        'MARS': 'Mars period brings energy, courage, and opportunities for action',
        'SATURN': 'Saturn period teaches discipline, patience, and long-term planning'
      };
      
      if (dashaGuidance[predictionData.dasha]) {
        guidance.push(`🕉️ ${dashaGuidance[predictionData.dasha]}`);
      }
    }

    // Spiritual guidance from insights
    if (insights.timing_guidance) {
      guidance.push(`✨ ${insights.timing_guidance}`);
    }

    return guidance.join('\n\n');
  }
}

module.exports = DeepSeekService;
