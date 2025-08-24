/**
 * Complete 27 Nakshatra System for Vedic Astrology
 * Based on traditional texts: Brihat Samhita, Muhurta Chintamani, and Jataka Parijata
 */

class NakshatraSystem {
  constructor() {
    // Complete 27 Nakshatras with comprehensive spiritual and predictive data
    this.nakshatras = {
      1: {
        name: 'Ashwini',
        nameInSanskrit: 'अश्विनी',
        startDegree: 0.0,
        endDegree: 13.333,
        deity: 'Ashwini Kumaras (Divine Healers)',
        ruling_planet: 'Ketu',
        symbol: 'Horse Head',
        gana: 'Deva',
        nature: 'Light/Swift',
        spiritual_significance: 'Divine healing, swift action, initiation of new beginnings',
        personality_traits: ['pioneering', 'healing', 'impulsive', 'energetic', 'helpful'],
        favorable_activities: ['healing', 'starting new ventures', 'travel', 'medical procedures'],
        career_inclinations: ['medicine', 'sports', 'transportation', 'emergency services'],
        spiritual_lesson: 'Service through healing and swift action',
        compatibility_nakshatras: ['Bharani', 'Magha', 'Mula'],
        element: 'Earth',
        temperament: 'Kapha',
        lucky_numbers: [1, 8, 15],
        colors: ['Red', 'Orange'],
        gemstone: 'Red Coral',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Pioneering spirit' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Material comfort' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Communication skills' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional healing' }
        ]
      },
      2: {
        name: 'Bharani',
        nameInSanskrit: 'भरणी',
        startDegree: 13.333,
        endDegree: 26.666,
        deity: 'Yama (God of Death/Restraint)',
        ruling_planet: 'Venus',
        symbol: 'Yoni (Womb)',
        gana: 'Manushya',
        nature: 'Ugra (Fierce)',
        spiritual_significance: 'Transformation, moral values, bearing responsibilities',
        personality_traits: ['determined', 'moral', 'creative', 'intense', 'responsible'],
        favorable_activities: ['creative work', 'dealing with endings', 'transformation rituals'],
        career_inclinations: ['arts', 'entertainment', 'law', 'psychology', 'funeral services'],
        spiritual_lesson: 'Understanding the cycle of life and death',
        compatibility_nakshatras: ['Ashwini', 'Rohini', 'Pushya'],
        element: 'Earth',
        temperament: 'Pitta',
        lucky_numbers: [6, 13, 20],
        colors: ['Red', 'Yellow'],
        gemstone: 'Diamond',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Leadership in creativity' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Perfectionist nature' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Artistic sensibilities' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Transformative power' }
        ]
      },
      3: {
        name: 'Krittika',
        nameInSanskrit: 'कृत्तिका',
        startDegree: 26.666,
        endDegree: 40.0,
        deity: 'Agni (Fire God)',
        ruling_planet: 'Sun',
        symbol: 'Razor/Flame',
        gana: 'Rakshasa',
        nature: 'Mishra (Mixed)',
        spiritual_significance: 'Purification through fire, cutting through illusion',
        personality_traits: ['sharp', 'determined', 'purifying', 'leadership', 'protective'],
        favorable_activities: ['purification rituals', 'leadership roles', 'cutting negative ties'],
        career_inclinations: ['military', 'surgery', 'metallurgy', 'cooking', 'spiritual teaching'],
        spiritual_lesson: 'Purification and righteous action',
        compatibility_nakshatras: ['Pushya', 'Uttara Phalguni', 'Uttara Ashadha'],
        element: 'Fire',
        temperament: 'Pitta',
        lucky_numbers: [1, 8, 27],
        colors: ['White', 'Red'],
        gemstone: 'Ruby',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical fire' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Disciplined action' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Revolutionary spirit' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Spiritual purification' }
        ]
      },
      4: {
        name: 'Rohini',
        nameInSanskrit: 'रोहिणी',
        startDegree: 40.0,
        endDegree: 53.333,
        deity: 'Brahma (Creator)',
        ruling_planet: 'Moon',
        symbol: 'Chariot/Temple',
        gana: 'Manushya',
        nature: 'Dhruva (Fixed)',
        spiritual_significance: 'Growth, fertility, creative manifestation',
        personality_traits: ['creative', 'attractive', 'stable', 'nurturing', 'materialistic'],
        favorable_activities: ['starting businesses', 'creative projects', 'agriculture', 'relationships'],
        career_inclinations: ['arts', 'agriculture', 'fashion', 'food industry', 'real estate'],
        spiritual_lesson: 'Balancing material and spiritual growth',
        compatibility_nakshatras: ['Mrigashirsha', 'Hasta', 'Shravana'],
        element: 'Earth',
        temperament: 'Kapha',
        lucky_numbers: [2, 9, 16],
        colors: ['White', 'Pink'],
        gemstone: 'Pearl',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Dynamic creativity' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Material abundance' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Intellectual pursuits' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional depth' }
        ]
      },
      5: {
        name: 'Mrigashirsha',
        nameInSanskrit: 'मृगशीर्ष',
        startDegree: 53.333,
        endDegree: 66.666,
        deity: 'Soma (Moon)',
        ruling_planet: 'Mars',
        symbol: 'Deer Head',
        gana: 'Deva',
        nature: 'Mridu (Soft)',
        spiritual_significance: 'Seeking, searching for truth, gentle nature',
        personality_traits: ['curious', 'gentle', 'searching', 'intelligent', 'restless'],
        favorable_activities: ['research', 'travel', 'learning', 'artistic pursuits'],
        career_inclinations: ['research', 'writing', 'travel', 'textiles', 'fragrance industry'],
        spiritual_lesson: 'The eternal quest for truth and knowledge',
        compatibility_nakshatras: ['Rohini', 'Chitra', 'Dhanishta'],
        element: 'Earth',
        temperament: 'Vata',
        lucky_numbers: [9, 18, 27],
        colors: ['Silver', 'Red'],
        gemstone: 'Emerald',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Creative seeking' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Analytical mind' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Harmonious search' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Deep investigation' }
        ]
      },
      6: {
        name: 'Ardra',
        nameInSanskrit: 'आर्द्रा',
        startDegree: 66.666,
        endDegree: 80.0,
        deity: 'Rudra (Storm God)',
        ruling_planet: 'Rahu',
        symbol: 'Teardrop/Diamond',
        gana: 'Manushya',
        nature: 'Tikshna (Sharp)',
        spiritual_significance: 'Destruction and renewal, emotional cleansing',
        personality_traits: ['intense', 'transformative', 'emotional', 'innovative', 'rebellious'],
        favorable_activities: ['research', 'occult studies', 'demolition', 'innovation'],
        career_inclinations: ['technology', 'research', 'chemistry', 'psychology', 'detective work'],
        spiritual_lesson: 'Transformation through intense experiences',
        compatibility_nakshatras: ['Punarvasu', 'Swati', 'Shatabhisha'],
        element: 'Water',
        temperament: 'Vata',
        lucky_numbers: [4, 13, 22],
        colors: ['Green', 'Blue'],
        gemstone: 'Hessonite',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical transformation' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Structured change' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Revolutionary ideas' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Spiritual awakening' }
        ]
      },
      7: {
        name: 'Punarvasu',
        nameInSanskrit: 'पुनर्वसु',
        startDegree: 80.0,
        endDegree: 93.333,
        deity: 'Aditi (Mother of Gods)',
        ruling_planet: 'Jupiter',
        symbol: 'Bow and Quiver',
        gana: 'Deva',
        nature: 'Chara (Movable)',
        spiritual_significance: 'Return, renewal, abundance, maternal protection',
        personality_traits: ['optimistic', 'generous', 'protective', 'philosophical', 'repetitive'],
        favorable_activities: ['moving homes', 'starting fresh', 'teaching', 'spiritual practices'],
        career_inclinations: ['teaching', 'publishing', 'real estate', 'transportation', 'philosophy'],
        spiritual_lesson: 'Renewal and cyclical nature of existence',
        compatibility_nakshatras: ['Ardra', 'Pushya', 'Vishakha'],
        element: 'Water',
        temperament: 'Kapha',
        lucky_numbers: [3, 12, 21],
        colors: ['Yellow', 'White'],
        gemstone: 'Yellow Sapphire',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Fresh beginnings' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Material restoration' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Communication renewal' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional healing' }
        ]
      },
      8: {
        name: 'Pushya',
        nameInSanskrit: 'पुष्य',
        startDegree: 93.333,
        endDegree: 106.666,
        deity: 'Brihaspati (Jupiter)',
        ruling_planet: 'Saturn',
        symbol: 'Cow\'s Udder/Lotus',
        gana: 'Deva',
        nature: 'Kshipra (Quick)',
        spiritual_significance: 'Nourishment, spirituality, highest auspiciousness',
        personality_traits: ['nurturing', 'spiritual', 'disciplined', 'protective', 'generous'],
        favorable_activities: ['spiritual practices', 'education', 'healing', 'all auspicious activities'],
        career_inclinations: ['priesthood', 'teaching', 'agriculture', 'dairy industry', 'counseling'],
        spiritual_lesson: 'Providing nourishment and spiritual guidance',
        compatibility_nakshatras: ['Krittika', 'Punarvasu', 'Anuradha'],
        element: 'Water',
        temperament: 'Kapha',
        lucky_numbers: [8, 17, 26],
        colors: ['Yellow', 'Orange'],
        gemstone: 'Blue Sapphire',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Spiritual leadership' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Service orientation' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Harmonious nurturing' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Deep spiritual insight' }
        ]
      },
      9: {
        name: 'Ashlesha',
        nameInSanskrit: 'आश्लेषा',
        startDegree: 106.666,
        endDegree: 120.0,
        deity: 'Nagas (Serpent Gods)',
        ruling_planet: 'Mercury',
        symbol: 'Coiled Serpent',
        gana: 'Rakshasa',
        nature: 'Tikshna (Sharp)',
        spiritual_significance: 'Kundalini energy, hypnotic power, transformation',
        personality_traits: ['mysterious', 'intuitive', 'manipulative', 'wise', 'secretive'],
        favorable_activities: ['occult practices', 'research', 'medicine', 'psychology'],
        career_inclinations: ['psychology', 'medicine', 'occult sciences', 'politics', 'investigation'],
        spiritual_lesson: 'Mastering subtle energies and inner wisdom',
        compatibility_nakshatras: ['Jyeshtha', 'Revati', 'Ashwini'],
        element: 'Water',
        temperament: 'Vata',
        lucky_numbers: [5, 14, 23],
        colors: ['Red', 'Black'],
        gemstone: 'Emerald',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical depth' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Practical wisdom' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Innovative insight' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Psychic abilities' }
        ]
      },
      10: {
        name: 'Magha',
        nameInSanskrit: 'मघा',
        startDegree: 120.0,
        endDegree: 133.333,
        deity: 'Pitrs (Ancestors)',
        ruling_planet: 'Ketu',
        symbol: 'Royal Throne',
        gana: 'Rakshasa',
        nature: 'Ugra (Fierce)',
        spiritual_significance: 'Ancestral connection, royal authority, tradition',
        personality_traits: ['regal', 'traditional', 'proud', 'generous', 'authoritative'],
        favorable_activities: ['honoring ancestors', 'leadership roles', 'ceremonies', 'traditional practices'],
        career_inclinations: ['government', 'archaeology', 'history', 'genealogy', 'traditional arts'],
        spiritual_lesson: 'Honoring lineage while creating new legacy',
        compatibility_nakshatras: ['Ashwini', 'Purva Phalguni', 'Purva Ashadha'],
        element: 'Water',
        temperament: 'Kapha',
        lucky_numbers: [7, 16, 25],
        colors: ['Golden', 'Orange'],
        gemstone: 'Cat\'s Eye',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Pioneering leadership' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Stable authority' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Intellectual nobility' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional regality' }
        ]
      },
      11: {
        name: 'Purva Phalguni',
        nameInSanskrit: 'पूर्व फाल्गुनी',
        startDegree: 133.333,
        endDegree: 146.666,
        deity: 'Bhaga (God of Fortune)',
        ruling_planet: 'Venus',
        symbol: 'Front Legs of Bed',
        gana: 'Manushya',
        nature: 'Ugra (Fierce)',
        spiritual_significance: 'Pleasure, luxury, creative expression, fortune',
        personality_traits: ['pleasure-loving', 'creative', 'generous', 'ambitious', 'romantic'],
        favorable_activities: ['creative arts', 'entertainment', 'luxury activities', 'romance'],
        career_inclinations: ['entertainment', 'hospitality', 'fashion', 'luxury goods', 'arts'],
        spiritual_lesson: 'Finding balance between pleasure and higher purpose',
        compatibility_nakshatras: ['Magha', 'Uttara Phalguni', 'Uttara Bhadrapada'],
        element: 'Water',
        temperament: 'Pitta',
        lucky_numbers: [6, 15, 24],
        colors: ['Light Blue', 'Pink'],
        gemstone: 'Diamond',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Royal pleasure' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Refined taste' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Artistic beauty' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Intense passion' }
        ]
      },
      12: {
        name: 'Uttara Phalguni',
        nameInSanskrit: 'उत्तर फाल्गुनी',
        startDegree: 146.666,
        endDegree: 160.0,
        deity: 'Aryaman (God of Contracts)',
        ruling_planet: 'Sun',
        symbol: 'Back Legs of Bed',
        gana: 'Manushya',
        nature: 'Dhruva (Fixed)',
        spiritual_significance: 'Partnership, contracts, stability, patronage',
        personality_traits: ['reliable', 'generous', 'organized', 'helpful', 'stable'],
        favorable_activities: ['partnerships', 'marriages', 'contracts', 'charity', 'organization'],
        career_inclinations: ['banking', 'social work', 'partnerships', 'contracts', 'management'],
        spiritual_lesson: 'Service through reliable partnerships and patronage',
        compatibility_nakshatras: ['Krittika', 'Purva Phalguni', 'Hasta'],
        element: 'Fire',
        temperament: 'Vata',
        lucky_numbers: [1, 10, 19],
        colors: ['Golden', 'Orange'],
        gemstone: 'Ruby',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical partnerships' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Organized support' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Progressive alliances' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Spiritual unions' }
        ]
      },
      13: {
        name: 'Hasta',
        nameInSanskrit: 'हस्त',
        startDegree: 160.0,
        endDegree: 173.333,
        deity: 'Savitar (Sun God)',
        ruling_planet: 'Moon',
        symbol: 'Hand/Palm',
        gana: 'Deva',
        nature: 'Kshipra (Quick)',
        spiritual_significance: 'Skill, dexterity, manifestation through hands',
        personality_traits: ['skillful', 'hardworking', 'intelligent', 'honest', 'industrious'],
        favorable_activities: ['crafts', 'healing', 'business', 'detailed work', 'teaching'],
        career_inclinations: ['handicrafts', 'healing', 'business', 'technology', 'detailed professions'],
        spiritual_lesson: 'Manifestation through skillful action and service',
        compatibility_nakshatras: ['Rohini', 'Uttara Phalguni', 'Chitra'],
        element: 'Earth',
        temperament: 'Vata',
        lucky_numbers: [2, 11, 20],
        colors: ['Green', 'Golden'],
        gemstone: 'Pearl',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Pioneering skills' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Practical craftsmanship' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Intellectual dexterity' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Nurturing touch' }
        ]
      },
      14: {
        name: 'Chitra',
        nameInSanskrit: 'चित्रा',
        startDegree: 173.333,
        endDegree: 186.666,
        deity: 'Tvastar (Divine Architect)',
        ruling_planet: 'Mars',
        symbol: 'Bright Jewel/Pearl',
        gana: 'Rakshasa',
        nature: 'Mridu (Soft)',
        spiritual_significance: 'Beauty, artistry, cosmic architecture, illusion',
        personality_traits: ['artistic', 'charismatic', 'passionate', 'attractive', 'perceptive'],
        favorable_activities: ['arts', 'architecture', 'design', 'photography', 'cosmetics'],
        career_inclinations: ['architecture', 'fine arts', 'fashion', 'interior design', 'photography'],
        spiritual_lesson: 'Creating beauty while understanding the nature of illusion',
        compatibility_nakshatras: ['Mrigashirsha', 'Hasta', 'Vishakha'],
        element: 'Fire',
        temperament: 'Pitta',
        lucky_numbers: [9, 18, 27],
        colors: ['Black', 'Blue'],
        gemstone: 'Red Coral',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Dramatic artistry' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Detailed perfection' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Harmonious beauty' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Mysterious allure' }
        ]
      },
      15: {
        name: 'Swati',
        nameInSanskrit: 'स्वाति',
        startDegree: 186.666,
        endDegree: 200.0,
        deity: 'Vayu (Wind God)',
        ruling_planet: 'Rahu',
        symbol: 'Young Shoot/Coral',
        gana: 'Deva',
        nature: 'Chara (Movable)',
        spiritual_significance: 'Independence, flexibility, movement, growth',
        personality_traits: ['independent', 'flexible', 'diplomatic', 'freedom-loving', 'adaptable'],
        favorable_activities: ['trade', 'diplomacy', 'travel', 'learning', 'negotiation'],
        career_inclinations: ['trade', 'diplomacy', 'law', 'transportation', 'communication'],
        spiritual_lesson: 'Finding balance between independence and cooperation',
        compatibility_nakshatras: ['Ardra', 'Punarvasu', 'Shatabhisha'],
        element: 'Fire',
        temperament: 'Kapha',
        lucky_numbers: [4, 13, 22],
        colors: ['Black', 'Blue'],
        gemstone: 'Hessonite',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical freedom' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Structured independence' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Revolutionary spirit' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Spiritual flexibility' }
        ]
      },
      16: {
        name: 'Vishakha',
        nameInSanskrit: 'विशाखा',
        startDegree: 200.0,
        endDegree: 213.333,
        deity: 'Indra and Agni',
        ruling_planet: 'Jupiter',
        symbol: 'Triumphal Arch',
        gana: 'Rakshasa',
        nature: 'Mishra (Mixed)',
        spiritual_significance: 'Determination, goal achievement, transformation',
        personality_traits: ['determined', 'goal-oriented', 'ambitious', 'jealous', 'competitive'],
        favorable_activities: ['goal-setting', 'competitions', 'achievements', 'transformations'],
        career_inclinations: ['politics', 'law', 'military', 'research', 'competitive fields'],
        spiritual_lesson: 'Channeling ambition toward higher purposes',
        compatibility_nakshatras: ['Punarvasu', 'Chitra', 'Purva Bhadrapada'],
        element: 'Fire',
        temperament: 'Kapha',
        lucky_numbers: [3, 12, 21],
        colors: ['Golden', 'Red'],
        gemstone: 'Yellow Sapphire',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Pioneering achievement' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Material success' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Intellectual victory' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional triumph' }
        ]
      },
      17: {
        name: 'Anuradha',
        nameInSanskrit: 'अनुराधा',
        startDegree: 213.333,
        endDegree: 226.666,
        deity: 'Mitra (God of Friendship)',
        ruling_planet: 'Saturn',
        symbol: 'Lotus Flower',
        gana: 'Deva',
        nature: 'Mridu (Soft)',
        spiritual_significance: 'Devotion, friendship, balance, discipline',
        personality_traits: ['devoted', 'balanced', 'diplomatic', 'spiritual', 'friendly'],
        favorable_activities: ['devotion', 'friendships', 'group activities', 'spiritual practices'],
        career_inclinations: ['counseling', 'diplomacy', 'group leadership', 'spiritual teaching', 'psychology'],
        spiritual_lesson: 'Devotion and service in harmonious relationships',
        compatibility_nakshatras: ['Pushya', 'Jyeshtha', 'Uttara Bhadrapada'],
        element: 'Fire',
        temperament: 'Pitta',
        lucky_numbers: [8, 17, 26],
        colors: ['Red', 'Orange'],
        gemstone: 'Blue Sapphire',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Leadership in devotion' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Service orientation' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Harmonious relationships' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Deep spiritual connection' }
        ]
      },
      18: {
        name: 'Jyeshtha',
        nameInSanskrit: 'ज्येष्ठा',
        startDegree: 226.666,
        endDegree: 240.0,
        deity: 'Indra (King of Gods)',
        ruling_planet: 'Mercury',
        symbol: 'Circular Amulet/Earring',
        gana: 'Rakshasa',
        nature: 'Tikshna (Sharp)',
        spiritual_significance: 'Seniority, protection, responsibility, occult power',
        personality_traits: ['protective', 'responsible', 'authoritative', 'occult', 'senior'],
        favorable_activities: ['protection rituals', 'occult practices', 'taking responsibility', 'leadership'],
        career_inclinations: ['occult sciences', 'police', 'military', 'investigation', 'security'],
        spiritual_lesson: 'Using power and authority for protection and guidance',
        compatibility_nakshatras: ['Ashlesha', 'Anuradha', 'Mula'],
        element: 'Air',
        temperament: 'Vata',
        lucky_numbers: [5, 14, 23],
        colors: ['Red', 'Orange'],
        gemstone: 'Emerald',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical authority' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Disciplined leadership' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Progressive protection' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Spiritual guardianship' }
        ]
      },
      19: {
        name: 'Mula',
        nameInSanskrit: 'मूल',
        startDegree: 240.0,
        endDegree: 253.333,
        deity: 'Nirriti (Goddess of Destruction)',
        ruling_planet: 'Ketu',
        symbol: 'Bundle of Roots',
        gana: 'Rakshasa',
        nature: 'Tikshna (Sharp)',
        spiritual_significance: 'Getting to the root, investigation, transformation',
        personality_traits: ['investigative', 'philosophical', 'proud', 'destructive', 'spiritual'],
        favorable_activities: ['research', 'investigation', 'root cause analysis', 'spiritual inquiry'],
        career_inclinations: ['research', 'medicine', 'investigation', 'philosophy', 'agriculture'],
        spiritual_lesson: 'Understanding the root causes and fundamental truths',
        compatibility_nakshatras: ['Ashwini', 'Magha', 'Jyeshtha'],
        element: 'Air',
        temperament: 'Vata',
        lucky_numbers: [7, 16, 25],
        colors: ['Brown', 'Golden'],
        gemstone: 'Cat\'s Eye',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Pioneering investigation' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Practical research' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Intellectual inquiry' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional depth' }
        ]
      },
      20: {
        name: 'Purva Ashadha',
        nameInSanskrit: 'पूर्व आषाढ़ा',
        startDegree: 253.333,
        endDegree: 266.666,
        deity: 'Apas (Water)',
        ruling_planet: 'Venus',
        symbol: 'Fan/Winnowing Basket',
        gana: 'Manushya',
        nature: 'Ugra (Fierce)',
        spiritual_significance: 'Purification, invincibility, early victory',
        personality_traits: ['proud', 'invincible', 'purifying', 'determined', 'influential'],
        favorable_activities: ['purification', 'debates', 'competitions', 'leadership'],
        career_inclinations: ['debate', 'law', 'water sports', 'shipping', 'purification industries'],
        spiritual_lesson: 'Achieving victory through purification and righteousness',
        compatibility_nakshatras: ['Magha', 'Uttara Ashadha', 'Purva Bhadrapada'],
        element: 'Air',
        temperament: 'Pitta',
        lucky_numbers: [6, 15, 24],
        colors: ['Black', 'White'],
        gemstone: 'Diamond',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Proud victory' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Methodical purification' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Balanced competition' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Transformative power' }
        ]
      },
      21: {
        name: 'Uttara Ashadha',
        nameInSanskrit: 'उत्तर आषाढ़ा',
        startDegree: 266.666,
        endDegree: 280.0,
        deity: 'Vishvadevas (Universal Gods)',
        ruling_planet: 'Sun',
        symbol: 'Elephant Tusk/Planks',
        gana: 'Manushya',
        nature: 'Dhruva (Fixed)',
        spiritual_significance: 'Final victory, righteousness, universal truth',
        personality_traits: ['righteous', 'grateful', 'popular', 'responsible', 'leadership'],
        favorable_activities: ['righteous actions', 'permanent structures', 'leadership roles'],
        career_inclinations: ['government', 'social service', 'construction', 'permanent institutions'],
        spiritual_lesson: 'Establishing lasting righteousness and universal principles',
        compatibility_nakshatras: ['Krittika', 'Purva Ashadha', 'Abhijit'],
        element: 'Air',
        temperament: 'Kapha',
        lucky_numbers: [1, 10, 19],
        colors: ['Orange', 'Yellow'],
        gemstone: 'Ruby',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical leadership' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Institutional authority' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Universal service' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Spiritual righteousness' }
        ]
      },
      22: {
        name: 'Shravana',
        nameInSanskrit: 'श्रवण',
        startDegree: 280.0,
        endDegree: 293.333,
        deity: 'Vishnu (Preserver)',
        ruling_planet: 'Moon',
        symbol: 'Ear/Three Footprints',
        gana: 'Deva',
        nature: 'Chara (Movable)',
        spiritual_significance: 'Learning, listening, knowledge preservation',
        personality_traits: ['learned', 'communicative', 'fame-seeking', 'organized', 'traditional'],
        favorable_activities: ['learning', 'teaching', 'communication', 'traditional practices'],
        career_inclinations: ['education', 'media', 'communication', 'traditional knowledge', 'counseling'],
        spiritual_lesson: 'Gaining wisdom through careful listening and learning',
        compatibility_nakshatras: ['Rohini', 'Pushya', 'Dhanishta'],
        element: 'Air',
        temperament: 'Kapha',
        lucky_numbers: [2, 11, 20],
        colors: ['Light Blue', 'White'],
        gemstone: 'Pearl',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Dynamic learning' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Stable knowledge' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Communicative wisdom' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional understanding' }
        ]
      },
      23: {
        name: 'Dhanishta',
        nameInSanskrit: 'धनिष्ठा',
        startDegree: 293.333,
        endDegree: 306.666,
        deity: 'Ashta Vasus (Eight Vasus)',
        ruling_planet: 'Mars',
        symbol: 'Musical Drum/Flute',
        gana: 'Rakshasa',
        nature: 'Chara (Movable)',
        spiritual_significance: 'Wealth, music, fame, group harmony',
        personality_traits: ['musical', 'wealthy', 'famous', 'generous', 'group-oriented'],
        favorable_activities: ['music', 'group activities', 'wealth creation', 'celebrations'],
        career_inclinations: ['music', 'entertainment', 'group leadership', 'finance', 'real estate'],
        spiritual_lesson: 'Using wealth and talents for collective benefit',
        compatibility_nakshatras: ['Mrigashirsha', 'Shravana', 'Shatabhisha'],
        element: 'Ether',
        temperament: 'Pitta',
        lucky_numbers: [9, 18, 27],
        colors: ['Silver', 'Golden'],
        gemstone: 'Red Coral',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Leadership in music' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Practical wealth' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Harmonious fame' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Transformative rhythm' }
        ]
      },
      24: {
        name: 'Shatabhisha',
        nameInSanskrit: 'शतभिषा',
        startDegree: 306.666,
        endDegree: 320.0,
        deity: 'Varuna (Water God)',
        ruling_planet: 'Rahu',
        symbol: 'Empty Circle/1000 Flowers',
        gana: 'Rakshasa',
        nature: 'Chara (Movable)',
        spiritual_significance: 'Healing, mysticism, solitude, innovation',
        personality_traits: ['mystical', 'healing', 'innovative', 'reclusive', 'philosophical'],
        favorable_activities: ['healing', 'research', 'innovation', 'mystical practices'],
        career_inclinations: ['healing', 'research', 'astronomy', 'astrology', 'innovation'],
        spiritual_lesson: 'Healing through mystical understanding and innovation',
        compatibility_nakshatras: ['Ardra', 'Swati', 'Dhanishta'],
        element: 'Ether',
        temperament: 'Vata',
        lucky_numbers: [4, 13, 22],
        colors: ['Blue', 'Green'],
        gemstone: 'Hessonite',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical healing' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Systematic innovation' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Revolutionary insight' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Mystical healing' }
        ]
      },
      25: {
        name: 'Purva Bhadrapada',
        nameInSanskrit: 'पूर्व भाद्रपदा',
        startDegree: 320.0,
        endDegree: 333.333,
        deity: 'Aja Ekapada (One-footed Goat)',
        ruling_planet: 'Jupiter',
        symbol: 'Front Legs of Funeral Cot',
        gana: 'Manushya',
        nature: 'Ugra (Fierce)',
        spiritual_significance: 'Transformation, occult power, spiritual insight',
        personality_traits: ['spiritual', 'eccentric', 'transformative', 'philosophical', 'dualistic'],
        favorable_activities: ['spiritual practices', 'occult studies', 'philosophical inquiry'],
        career_inclinations: ['spiritual teaching', 'occult sciences', 'philosophy', 'research', 'funeral services'],
        spiritual_lesson: 'Transformation through spiritual understanding and sacrifice',
        compatibility_nakshatras: ['Vishakha', 'Purva Ashadha', 'Uttara Bhadrapada'],
        element: 'Ether',
        temperament: 'Vata',
        lucky_numbers: [3, 12, 21],
        colors: ['Silver', 'Purple'],
        gemstone: 'Yellow Sapphire',
        pada_details: [
          { pada: 1, navamsa: 'Aries', characteristics: 'Pioneering spirituality' },
          { pada: 2, navamsa: 'Taurus', characteristics: 'Grounded philosophy' },
          { pada: 3, navamsa: 'Gemini', characteristics: 'Intellectual transformation' },
          { pada: 4, navamsa: 'Cancer', characteristics: 'Emotional depth' }
        ]
      },
      26: {
        name: 'Uttara Bhadrapada',
        nameInSanskrit: 'उत्तर भाद्रपदा',
        startDegree: 333.333,
        endDegree: 346.666,
        deity: 'Ahir Budhnya (Serpent of Deep)',
        ruling_planet: 'Saturn',
        symbol: 'Back Legs of Funeral Cot',
        gana: 'Manushya',
        nature: 'Dhruva (Fixed)',
        spiritual_significance: 'Deep wisdom, kundalini, cosmic consciousness',
        personality_traits: ['wise', 'patient', 'depth', 'mysterious', 'spiritually evolved'],
        favorable_activities: ['deep meditation', 'kundalini practices', 'teaching wisdom'],
        career_inclinations: ['spiritual teaching', 'psychology', 'research', 'meditation', 'counseling'],
        spiritual_lesson: 'Attaining cosmic consciousness through deep spiritual practice',
        compatibility_nakshatras: ['Purva Phalguni', 'Anuradha', 'Purva Bhadrapada'],
        element: 'Ether',
        temperament: 'Pitta',
        lucky_numbers: [8, 17, 26],
        colors: ['Purple', 'Violet'],
        gemstone: 'Blue Sapphire',
        pada_details: [
          { pada: 1, navamsa: 'Leo', characteristics: 'Leadership in wisdom' },
          { pada: 2, navamsa: 'Virgo', characteristics: 'Methodical spirituality' },
          { pada: 3, navamsa: 'Libra', characteristics: 'Balanced consciousness' },
          { pada: 4, navamsa: 'Scorpio', characteristics: 'Deep transformation' }
        ]
      },
      27: {
        name: 'Revati',
        nameInSanskrit: 'रेवती',
        startDegree: 346.666,
        endDegree: 360.0,
        deity: 'Pushan (Nourisher)',
        ruling_planet: 'Mercury',
        symbol: 'Fish/Pair of Fish',
        gana: 'Deva',
        nature: 'Mridu (Soft)',
        spiritual_significance: 'Completion, nourishment, safe journey, prosperity',
        personality_traits: ['nurturing', 'protective', 'wealthy', 'kind', 'completing'],
        favorable_activities: ['travel', 'nourishment', 'completion of projects', 'prosperity rituals'],
        career_inclinations: ['travel industry', 'shipping', 'food industry', 'completion services', 'care-giving'],
        spiritual_lesson: 'Completing the cosmic cycle with nourishment and protection',
        compatibility_nakshatras: ['Ashlesha', 'Hasta', 'Uttara Bhadrapada'],
        element: 'Ether',
        temperament: 'Kapha',
        lucky_numbers: [5, 14, 23],
        colors: ['Brown', 'Golden'],
        gemstone: 'Emerald',
        pada_details: [
          { pada: 1, navamsa: 'Sagittarius', characteristics: 'Philosophical completion' },
          { pada: 2, navamsa: 'Capricorn', characteristics: 'Practical nourishment' },
          { pada: 3, navamsa: 'Aquarius', characteristics: 'Universal care' },
          { pada: 4, navamsa: 'Pisces', characteristics: 'Spiritual fulfillment' }
        ]
      }
    };
  }

  // Calculate nakshatra from longitude
  calculateNakshatra(longitude) {
    // Normalize longitude to 0-360 range
    const normalizedLongitude = ((longitude % 360) + 360) % 360;
    
    // Each nakshatra spans 13.333... degrees (360/27)
    const nakshatraIndex = Math.floor(normalizedLongitude / 13.333333333333334) + 1;
    
    // Calculate the exact position within the nakshatra
    const degreeInNakshatra = normalizedLongitude % 13.333333333333334;
    
    // Calculate pada (each nakshatra has 4 padas of 3.333... degrees each)
    const pada = Math.floor(degreeInNakshatra / 3.333333333333334) + 1;
    
    const nakshatra = this.nakshatras[nakshatraIndex];
    
    if (!nakshatra) {
      console.warn(`Nakshatra not found for index: ${nakshatraIndex}`);
      return null;
    }
    
    return {
      ...nakshatra,
      index: nakshatraIndex,
      degree_in_nakshatra: degreeInNakshatra,
      pada: pada,
      pada_details: nakshatra.pada_details[pada - 1]
    };
  }

  // Get spiritual compatibility between two nakshatras
  getSpiritualCompatibility(nakshatra1, nakshatra2) {
    const compatibility_matrix = {
      // Simplified compatibility based on gana and nature
      'Deva-Deva': 0.9,
      'Deva-Manushya': 0.7,
      'Deva-Rakshasa': 0.3,
      'Manushya-Manushya': 0.8,
      'Manushya-Rakshasa': 0.5,
      'Rakshasa-Rakshasa': 0.6
    };
    
    const gana1 = nakshatra1.gana;
    const gana2 = nakshatra2.gana;
    const compatibilityKey = `${gana1}-${gana2}`;
    
    return compatibility_matrix[compatibilityKey] || 0.5;
  }

  // Calculate spiritual strength based on nakshatra
  calculateSpiritualStrength(nakshatraData) {
    const baseStrength = {
      'Deva': 0.8,
      'Manushya': 0.6,
      'Rakshasa': 0.4
    }[nakshatraData.gana] || 0.5;
    
    const natureBonus = {
      'Dhruva': 0.2,  // Fixed nature adds stability
      'Chara': 0.1,   // Movable nature adds adaptability
      'Mishra': 0.15, // Mixed nature adds balance
      'Mridu': 0.1,   // Soft nature adds gentleness
      'Tikshna': -0.1, // Sharp nature can be challenging
      'Ugra': -0.05,  // Fierce nature adds intensity
      'Kshipra': 0.05 // Quick nature adds efficiency
    }[nakshatraData.nature] || 0;
    
    return Math.max(0, Math.min(1, baseStrength + natureBonus));
  }

  // Get deity influence for spiritual practices
  getDeityInfluence(nakshatraData) {
    const deity_influences = {
      'Ashwini Kumaras': { healing: 0.9, speed: 0.8, initiation: 0.8 },
      'Yama': { discipline: 0.9, moral_strength: 0.8, transformation: 0.7 },
      'Agni': { purification: 0.9, energy: 0.8, spiritual_fire: 0.9 },
      'Brahma': { creativity: 0.9, manifestation: 0.8, cosmic_wisdom: 0.7 },
      'Soma': { intuition: 0.8, receptivity: 0.9, lunar_connection: 0.8 },
      'Rudra': { transformation: 0.9, intensity: 0.8, spiritual_awakening: 0.9 },
      'Aditi': { protection: 0.8, abundance: 0.9, maternal_wisdom: 0.8 },
      'Brihaspati': { wisdom: 0.9, teaching: 0.9, spiritual_guidance: 0.9 },
      'Nagas': { kundalini: 0.9, hidden_knowledge: 0.8, mysticism: 0.9 },
      'Pitrs': { ancestral_wisdom: 0.8, tradition: 0.9, lineage: 0.8 },
      'Bhaga': { fortune: 0.8, luxury: 0.7, material_prosperity: 0.8 },
      'Aryaman': { partnerships: 0.8, contracts: 0.7, social_harmony: 0.8 },
      'Savitar': { skill: 0.8, manifestation: 0.9, solar_energy: 0.8 },
      'Tvastar': { artistry: 0.9, creation: 0.8, cosmic_architecture: 0.7 },
      'Vayu': { movement: 0.8, breath: 0.9, life_force: 0.8 },
      'Indra and Agni': { power: 0.9, achievement: 0.8, victory: 0.9 },
      'Mitra': { friendship: 0.9, harmony: 0.8, devotion: 0.8 },
      'Indra': { leadership: 0.9, protection: 0.8, authority: 0.9 },
      'Nirriti': { destruction: 0.7, investigation: 0.8, root_causes: 0.9 },
      'Apas': { purification: 0.8, flow: 0.7, cleansing: 0.8 },
      'Vishvadevas': { universality: 0.9, righteousness: 0.9, cosmic_order: 0.8 },
      'Vishnu': { preservation: 0.9, learning: 0.8, divine_knowledge: 0.9 },
      'Ashta Vasus': { wealth: 0.8, music: 0.9, harmony: 0.8 },
      'Varuna': { healing: 0.9, mysticism: 0.8, cosmic_law: 0.8 },
      'Aja Ekapada': { spiritual_insight: 0.9, transformation: 0.8, occult_power: 0.9 },
      'Ahir Budhnya': { deep_wisdom: 0.9, kundalini: 0.9, cosmic_consciousness: 0.9 },
      'Pushan': { nourishment: 0.8, protection: 0.8, completion: 0.9 }
    };
    
    return deity_influences[nakshatraData.deity] || {
      general_blessing: 0.5,
      spiritual_protection: 0.5,
      divine_guidance: 0.5
    };
  }

  // Get favorable timing based on nakshatra
  getFavorableTiming(nakshatraData) {
    const timing_matrix = {
      'Ashwini': { start_new_ventures: 0.9, healing: 0.9, travel: 0.8 },
      'Bharani': { creative_work: 0.9, transformation: 0.8, endings: 0.7 },
      'Krittika': { purification: 0.9, cutting_ties: 0.8, leadership: 0.8 },
      'Rohini': { agriculture: 0.9, business: 0.8, relationships: 0.8 },
      'Mrigashirsha': { research: 0.9, travel: 0.8, learning: 0.8 },
      'Ardra': { research: 0.8, innovation: 0.9, transformation: 0.8 },
      'Punarvasu': { moving: 0.9, renewal: 0.9, teaching: 0.8 },
      'Pushya': { spiritual_practices: 0.9, education: 0.9, healing: 0.8 },
      'Ashlesha': { occult_practices: 0.9, psychology: 0.8, medicine: 0.8 },
      'Magha': { ceremonies: 0.9, leadership: 0.8, honoring_ancestors: 0.9 },
      'Purva Phalguni': { entertainment: 0.9, luxury: 0.8, romance: 0.8 },
      'Uttara Phalguni': { partnerships: 0.9, contracts: 0.8, charity: 0.8 },
      'Hasta': { crafts: 0.9, healing: 0.8, detailed_work: 0.9 },
      'Chitra': { arts: 0.9, architecture: 0.8, design: 0.9 },
      'Swati': { trade: 0.9, diplomacy: 0.8, travel: 0.8 },
      'Vishakha': { goal_achievement: 0.9, competitions: 0.8, transformation: 0.7 },
      'Anuradha': { friendships: 0.9, devotion: 0.8, group_activities: 0.8 },
      'Jyeshtha': { protection: 0.9, occult: 0.8, investigation: 0.8 },
      'Mula': { investigation: 0.9, research: 0.8, spiritual_inquiry: 0.8 },
      'Purva Ashadha': { purification: 0.8, debates: 0.9, leadership: 0.8 },
      'Uttara Ashadha': { permanent_structures: 0.9, righteousness: 0.9, leadership: 0.8 },
      'Shravana': { learning: 0.9, communication: 0.8, traditional_practices: 0.8 },
      'Dhanishta': { music: 0.9, group_activities: 0.8, wealth_creation: 0.8 },
      'Shatabhisha': { healing: 0.9, innovation: 0.8, mystical_practices: 0.9 },
      'Purva Bhadrapada': { spiritual_practices: 0.9, philosophy: 0.8, transformation: 0.8 },
      'Uttara Bhadrapada': { meditation: 0.9, wisdom_teaching: 0.8, kundalini: 0.9 },
      'Revati': { travel: 0.9, completion: 0.9, nourishment: 0.8 }
    };
    
    return timing_matrix[nakshatraData.name] || {
      general_activities: 0.5,
      spiritual_practices: 0.5,
      material_pursuits: 0.5
    };
  }
}

module.exports = NakshatraSystem;
