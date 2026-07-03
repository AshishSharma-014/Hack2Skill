const categoryRules = [
  { issueType: 'Water', icon: 'water', keywords: ['water', 'pipe', 'pipeline', 'drain', 'sewage', 'leak'] },
  { issueType: 'Roads', icon: 'road', keywords: ['road', 'pothole', 'street', 'bridge', 'traffic'] },
  { issueType: 'Health', icon: 'health', keywords: ['hospital', 'clinic', 'doctor', 'medicine', 'ambulance'] },
  { issueType: 'Education', icon: 'school', keywords: ['school', 'teacher', 'classroom', 'student'] },
  { issueType: 'Street Lighting', icon: 'light', keywords: ['light', 'lamp', 'dark', 'pole'] },
  { issueType: 'Sanitation', icon: 'clean', keywords: ['garbage', 'waste', 'toilet', 'dirty', 'clean'] }
];

const severityBoosts = [
  { words: ['hospital', 'school', 'sewage', 'accident', 'unsafe'], score: 3 },
  { words: ['broken', 'leak', 'blocked', 'flood', 'urgent'], score: 2 },
  { words: ['repair', 'install', 'request'], score: 1 }
];

function analyzeComplaint({ description = '', locationText = '' }) {
  const text = `${description} ${locationText}`.toLowerCase();
  const matched = categoryRules.find(rule => rule.keywords.some(keyword => text.includes(keyword))) || {
    issueType: 'General Civic Issue',
    icon: 'civic'
  };

  let aiSeverity = 4;
  severityBoosts.forEach(group => {
    if (group.words.some(word => text.includes(word))) aiSeverity += group.score;
  });
  aiSeverity = Math.max(1, Math.min(10, aiSeverity));

  const crowdDemand = estimateCrowdDemand(text, aiSeverity);
  const demographicMultiplier = getDemographicMultiplier(matched.issueType, text);
  const priorityScore = Math.round(aiSeverity * crowdDemand * demographicMultiplier);
  const aiScore = Math.max(20, Math.min(98, Math.round((priorityScore / 5) + aiSeverity * 5)));

  return {
    issueType: matched.issueType,
    demand: buildDemand(matched.issueType, description),
    aiSeverity,
    crowdDemand,
    demographicMultiplier,
    priorityScore,
    aiScore
  };
}

function estimateCrowdDemand(text, aiSeverity) {
  const areaWeight = text.includes('ward') || text.includes('village') || text.includes('colony') ? 18 : 10;
  const urgencyWeight = aiSeverity >= 8 ? 24 : aiSeverity >= 6 ? 16 : 8;
  return areaWeight + urgencyWeight;
}

function getDemographicMultiplier(issueType, text) {
  if (issueType === 'Education' && (text.includes('village') || text.includes('children'))) return 1.5;
  if (issueType === 'Health' && (text.includes('village') || text.includes('emergency'))) return 1.45;
  if (issueType === 'Water' && text.includes('ward')) return 1.2;
  if (issueType === 'Roads' && text.includes('accident')) return 1.25;
  return 1;
}

function buildDemand(issueType, description) {
  const shortText = description.trim().split(/[.?!]/)[0].slice(0, 80);
  if (shortText) return shortText;
  return `${issueType} department intervention`;
}

module.exports = {
  analyzeComplaint
};
