// Waste category constants — values match backend POINTS_MAP in config/constants.js
// Category IDs must match backend WASTE_CATEGORIES: wet, dry, e_waste
export const wasteCategories = [
  { id: 'wet',     label: 'Wet Waste',  color: '#4CAF50', points: 5,  emoji: '🟢' },
  { id: 'dry',     label: 'Dry Waste',  color: '#2196F3', points: 8,  emoji: '🔵' },
  { id: 'e_waste', label: 'E-Waste',    color: '#FFC107', points: 12, emoji: '🟡' },
];
