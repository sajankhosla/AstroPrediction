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
      aspects = []
    } = astrologyData;

    let prompt = `Please analyze this person's Vedic astrology chart and provide positive, empowering insights:

**Birth Chart Overview:**
- Current positivity score: ${positivityScore}
- Current Dasha period: ${dasha}
- Overall spiritual strength: ${spiritualProfile.overall_spiritual_strength || 'Unknown'}

**Planetary Positions and Nakshatras:**\n`;

    // Add planetary position details
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && typeof data === 'object' && data.nakshatra) {
        prompt += `- ${planet}: ${data.nakshatra.name} nakshatra (${data.nakshatra.spiritual_significance})\n`;
        prompt += `  Dignity: ${data.dignity?.status || 'Unknown'}, House: ${data.house}\n`;
        if (data.nakshatra.spiritual_lesson) {
          prompt += `  Spiritual lesson: ${data.nakshatra.spiritual_lesson}\n`;
        }
      }
    }

    // Add spiritual profile information
    if (spiritualProfile.birth_moon_nakshatra) {
      prompt += `\n**Birth Moon Nakshatra:** ${spiritualProfile.birth_moon_nakshatra.name}`;
      prompt += `\n**Spiritual Path:** ${spiritualProfile.spiritual_path || 'General spiritual development'}`;
    }

    if (spiritualProfile.spiritual_gifts && spiritualProfile.spiritual_gifts.length > 0) {
      prompt += `\n**Spiritual Gifts:** ${spiritualProfile.spiritual_gifts.join(', ')}`;
    }

    if (spiritualProfile.spiritual_challenges && spiritualProfile.spiritual_challenges.length > 0) {
      prompt += `\n**Growth Areas:** ${spiritualProfile.spiritual_challenges.join(', ')}`;
    }

    // Add karmic insights
    if (spiritualProfile.karmic_indicators) {
      const karmic = spiritualProfile.karmic_indicators;
      if (karmic.rahu_position) {
        prompt += `\n**Rahu (Life Purpose):** House ${karmic.rahu_position.house} - ${karmic.rahu_position.lesson}`;
      }
      if (karmic.ketu_position) {
        prompt += `\n**Ketu (Past Wisdom):** House ${karmic.ketu_position.house} - ${karmic.ketu_position.lesson}`;
      }
    }

    // Add classical insights
    if (classicalInsights.detectedYogas && classicalInsights.detectedYogas.length > 0) {
      prompt += `\n**Beneficial Yogas:** ${classicalInsights.detectedYogas.map(y => y.name).join(', ')}`;
    }

    prompt += `\n\nPlease provide encouraging, positive insights that help this person understand their unique cosmic blueprint and how to make the most of their spiritual and material journey.`;

    return prompt;
  }

  generateFallbackInsights(astrologyData) {
    const {
      planetaryPositions = {},
      spiritualProfile = {},
      positivityScore = 0,
      dasha = 'Unknown'
    } = astrologyData;

    // Generate basic positive insights based on available data
    const strengths = [];
    const opportunities = [];
    const spiritualPractices = [];
    const dailyLife = [];

    // Analyze planetary strengths
    for (const [planet, data] of Object.entries(planetaryPositions)) {
      if (data && data.spiritual_strength > 0.6) {
        const planetStrengths = {
          'JUPITER': 'Natural wisdom and teaching abilities',
          'VENUS': 'Artistic talents and harmonious relationships',
          'MOON': 'Deep intuition and emotional intelligence',
          'MERCURY': 'Excellent communication and analytical skills',
          'SUN': 'Natural leadership and strong sense of self',
          'MARS': 'Courage and ability to take decisive action',
          'SATURN': 'Discipline and long-term planning abilities'
        };
        
        if (planetStrengths[planet]) {
          strengths.push(planetStrengths[planet]);
        }
      }
    }

    // Add moon nakshatra insights
    if (spiritualProfile.birth_moon_nakshatra) {
      const nakshatra = spiritualProfile.birth_moon_nakshatra;
      spiritualPractices.push(`Meditation on ${nakshatra.deity} for spiritual guidance`);
      dailyLife.push(`Focus on ${nakshatra.spiritual_significance.toLowerCase()}`);
    }

    // Basic recommendations based on positivity score
    if (positivityScore > 0.5) {
      opportunities.push('This is an excellent time for new beginnings and positive changes');
      dailyLife.push('Take advantage of favorable cosmic energies for important decisions');
    } else if (positivityScore > 0) {
      opportunities.push('Mixed influences suggest balanced approach and patience');
      dailyLife.push('Focus on steady progress and building strong foundations');
    } else {
      opportunities.push('Challenging periods offer valuable lessons and inner strength building');
      dailyLife.push('Practice patience and focus on inner development during this transformative time');
    }

    return {
      summary: `Your cosmic blueprint reveals a unique blend of talents and opportunities for growth. With careful attention to timing and spiritual practices, you can navigate life's challenges while maximizing your natural strengths.`,
      strengths: strengths.length > 0 ? strengths : ['Resilient spirit and adaptability', 'Unique perspective on life'],
      opportunities: opportunities,
      recommendations: {
        spiritual_practices: spiritualPractices.length > 0 ? spiritualPractices : ['Daily meditation', 'Gratitude practice'],
        daily_life: dailyLife,
        relationships: ['Practice compassion and understanding', 'Communicate openly and honestly'],
        career: ['Align work with your natural talents', 'Seek opportunities for growth and learning']
      },
      timing_guidance: `Current cosmic influences suggest ${positivityScore > 0 ? 'favorable' : 'reflective'} timing. Use this period for ${positivityScore > 0 ? 'action and progress' : 'planning and inner work'}.`,
      encouragement: 'Remember that you have the power to shape your destiny. The stars provide guidance, but your choices create your reality. Trust in your journey and embrace both challenges and opportunities as part of your cosmic growth.'
    };
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
