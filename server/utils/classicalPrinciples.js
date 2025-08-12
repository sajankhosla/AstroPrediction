const moment = require('moment');

// Zodiac sign helpers
function getSignIndexFromLongitude(longitude) {
  return Math.floor(((longitude % 360) + 360) % 360 / 30); // 0..11
}

const signNames = [
  'ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITTARIUS','CAPRICORN','AQUARIUS','PISCES'
];

// Exaltation/Debilitation signs by planet
const exaltationSignByPlanet = {
  SUN: 'ARIES',
  MOON: 'TAURUS',
  MARS: 'CAPRICORN',
  MERCURY: 'VIRGO',
  JUPITER: 'CANCER',
  VENUS: 'PISCES',
  SATURN: 'LIBRA'
};

const debilitationSignByPlanet = {
  SUN: 'LIBRA',
  MOON: 'SCORPIO',
  MARS: 'CANCER',
  MERCURY: 'PISCES',
  JUPITER: 'CAPRICORN',
  VENUS: 'VIRGO',
  SATURN: 'ARIES'
};

// Own signs by planet
const ownSignsByPlanet = {
  SUN: ['LEO'],
  MOON: ['CANCER'],
  MARS: ['ARIES','SCORPIO'],
  MERCURY: ['GEMINI','VIRGO'],
  JUPITER: ['SAGITTARIUS','PISCES'],
  VENUS: ['TAURUS','LIBRA'],
  SATURN: ['CAPRICORN','AQUARIUS']
};

// Simple natural friendships (approximate classical mapping)
const naturalFriends = {
  SUN: ['MOON','MARS','JUPITER'],
  MOON: ['SUN','MERCURY'],
  MARS: ['SUN','MOON','JUPITER'],
  MERCURY: ['SUN','VENUS'],
  JUPITER: ['SUN','MOON','MARS'],
  VENUS: ['MERCURY','SATURN'],
  SATURN: ['MERCURY','VENUS']
};

function computeDignity(planet, signName) {
  const result = { status: 'NEUTRAL', score: 0 };
  if (exaltationSignByPlanet[planet] === signName) {
    result.status = 'EXALTATION';
    result.score += 0.4;
    return result;
  }
  if (debilitationSignByPlanet[planet] === signName) {
    result.status = 'DEBILITATION';
    result.score -= 0.3;
    return result;
  }
  if ((ownSignsByPlanet[planet] || []).includes(signName)) {
    result.status = 'OWN_SIGN';
    result.score += 0.2;
    return result;
  }
  return result;
}

function houseCategory(houseNum) {
  if ([1,4,7,10].includes(houseNum)) return 'KENDRA';
  if ([1,5,9].includes(houseNum)) return 'TRIKONA';
  if ([6,8,12].includes(houseNum)) return 'DUSTHANA';
  return 'UPACHAYA'; // 3, 6, 10, 11 commonly treated as upachaya; simplified here
}

function scoreByHouseCategory(category) {
  switch (category) {
    case 'KENDRA': return 0.15;
    case 'TRIKONA': return 0.2;
    case 'DUSTHANA': return -0.15;
    case 'UPACHAYA': return 0.05;
    default: return 0;
  }
}

function withinDegrees(diff, tolerance) {
  const d = Math.abs(((diff + 180) % 360) - 180);
  return d <= tolerance;
}

// Detect a small set of classical yogas
function detectYogas(positions) {
  const yogas = [];
  const longitudes = {};
  const houses = {};
  Object.keys(positions).forEach(p => {
    longitudes[p] = positions[p].longitude;
    houses[p] = positions[p].house;
  });

  const isKendra = (h) => [1,4,7,10].includes(h);

  // Gajakesari Yoga: Moon and Jupiter in kendras from Lagna
  if (houses.MOON && houses.JUPITER && isKendra(houses.MOON) && isKendra(houses.JUPITER)) {
    yogas.push({ name: 'Gajakesari Yoga', source: 'Brihat Parashara, Phaladeepika', impact: 'Prosperity, intelligence, respect', score: 0.25 });
  }

  // Chandra-Mangala: Moon with Mars (conjunction within 10°)
  if (longitudes.MOON != null && longitudes.MARS != null && withinDegrees(longitudes.MOON - longitudes.MARS, 10)) {
    yogas.push({ name: 'Chandra-Mangala Yoga', source: 'Saravali, Phaladeepika', impact: 'Wealth creation, business acumen', score: 0.15 });
  }

  // Panch Mahapurusha: planet exalted/own in Kendra (except Sun/Moon)
  const pmpCandidates = [
    { planet: 'MARS', name: 'Ruchaka' },
    { planet: 'MERCURY', name: 'Bhadra' },
    { planet: 'JUPITER', name: 'Hamsa' },
    { planet: 'VENUS', name: 'Malavya' },
    { planet: 'SATURN', name: 'Shasha' }
  ];
  pmpCandidates.forEach(({ planet, name }) => {
    if (!houses[planet]) return;
    if (!isKendra(houses[planet])) return;
    const signName = signNames[getSignIndexFromLongitude(longitudes[planet])];
    const dignity = computeDignity(planet, signName);
    if (dignity.status === 'EXALTATION' || dignity.status === 'OWN_SIGN') {
      yogas.push({ name: `${name} Yoga`, source: 'Phaladeepika, Saravali', impact: 'Prominence and strong traits of the planet', score: 0.2 });
    }
  });

  return yogas;
}

// Jaimini Chara Karakas (simplified: based on absolute longitude within sign)
function computeJaiminiKarakas(positions) {
  const planetOrder = ['SUN','MOON','MARS','MERCURY','JUPITER','VENUS','SATURN'];
  const entries = planetOrder
    .filter(p => positions[p])
    .map(p => {
      const lon = positions[p].longitude;
      const degreesInSign = lon % 30;
      return { planet: p, degreesInSign };
    })
    .sort((a, b) => b.degreesInSign - a.degreesInSign);

  const karakaNames = ['Atmakaraka','Amatyakaraka','Bhratrikaraka','Matrikaraka','Putrakaraka','Gnatikaraka','Darakaraka'];
  const result = {};
  entries.forEach((e, idx) => {
    result[karakaNames[idx]] = e.planet;
  });
  return result;
}

function analyzeClassicalPrinciples(planetaryPositions) {
  const perPlanet = {};
  let cumulativeScore = 0;
  let count = 0;

  Object.keys(planetaryPositions).forEach(planet => {
    const pos = planetaryPositions[planet];
    const signIdx = getSignIndexFromLongitude(pos.longitude);
    const signName = signNames[signIdx];

    const dignity = computeDignity(planet, signName);
    const houseCat = houseCategory(pos.house);
    const houseScore = scoreByHouseCategory(houseCat);

    const score = dignity.score + houseScore;
    cumulativeScore += score;
    count++;

    perPlanet[planet] = {
      sign: signName,
      house: pos.house,
      dignity: dignity.status,
      dignityScore: dignity.score,
      houseCategory: houseCat,
      houseScore,
      totalContribution: score
    };
  });

  const yogas = detectYogas(planetaryPositions);
  const karakas = computeJaiminiKarakas(planetaryPositions);

  // Normalize classical contribution
  const baseContribution = count ? cumulativeScore / count : 0;
  const yogaContribution = yogas.reduce((acc, y) => acc + (y.score || 0), 0);
  // Cap contributions to avoid overpowering the main score
  const classicalAdjustment = Math.max(-0.4, Math.min(0.4, baseContribution + yogaContribution));

  return {
    perPlanet,
    yogas,
    karakas,
    classicalAdjustment: Number(classicalAdjustment.toFixed(3))
  };
}

module.exports = {
  analyzeClassicalPrinciples
};
