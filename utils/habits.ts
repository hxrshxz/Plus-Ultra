import { Habit } from '../types';

// ============================================
// DEFAULT HABITS CONFIGURATION
// ============================================

export const DEFAULT_HABITS: Habit[] = [
  // FITNESS
  {
    id: 'gym',
    name: 'Gym Session',
    emoji: '🏋️',
    type: 'boolean',
    category: 'fitness',
    color: '#10b981', // Emerald
  },
  {
    id: 'boxing',
    name: 'Boxing',
    emoji: '🥊',
    type: 'boolean',
    category: 'fitness',
    color: '#ef4444', // Red
  },
  {
    id: 'cardio',
    name: 'Cardio',
    emoji: '🏃',
    type: 'boolean',
    category: 'fitness',
    color: '#6366f1', // Indigo
  },
  {
    id: 'stretching',
    name: 'Stretching',
    emoji: '🧘',
    type: 'boolean',
    category: 'fitness',
    color: '#ec4899', // Pink
  },

  // NUTRITION
  {
    id: 'creatine',
    name: 'Creatine',
    emoji: '💊',
    type: 'boolean',
    category: 'nutrition',
    color: '#f59e0b', // Amber
  },
  {
    id: 'protein',
    name: 'Protein Shake',
    emoji: '🥤',
    type: 'boolean',
    category: 'nutrition',
    color: '#f97316', // Orange
  },
  {
    id: 'vitamins',
    name: 'Vitamins',
    emoji: '💊',
    type: 'boolean',
    category: 'nutrition',
    color: '#eab308', // Yellow
  },
  {
    id: 'clean-eating',
    name: 'Clean Eating',
    emoji: '🥗',
    type: 'boolean',
    category: 'nutrition',
    color: '#22c55e', // Green
  },

  // WELLNESS
  {
    id: 'water',
    name: 'Water',
    emoji: '💧',
    type: 'counter',
    target: 8,
    unit: 'glasses',
    category: 'wellness',
    color: '#0ea5e9', // Sky blue
  },
  {
    id: 'sleep',
    name: 'Sleep 7+ hrs',
    emoji: '😴',
    type: 'boolean',
    category: 'wellness',
    color: '#8b5cf6', // Violet
  },

  // DISCIPLINE
  {
    id: 'no-junk',
    name: 'No Junk Food',
    emoji: '📵',
    type: 'boolean',
    category: 'discipline',
    color: '#f43f5e', // Rose
  },
  {
    id: 'no-alcohol',
    name: 'No Alcohol',
    emoji: '🚫',
    type: 'boolean',
    category: 'discipline',
    color: '#a855f7', // Purple
  },
];

// ============================================
// HABIT HELPERS
// ============================================

export const getHabitById = (habits: Habit[], id: string): Habit | undefined => {
  return habits.find(h => h.id === id);
};

export const getHabitsByCategory = (habits: Habit[], category: string): Habit[] => {
  return habits.filter(h => h.category === category);
};

export const CATEGORY_LABELS: Record<string, string> = {
  fitness: '💪 Fitness',
  nutrition: '🥗 Nutrition',
  wellness: '✨ Wellness',
  discipline: '🎯 Discipline',
};

export const CATEGORY_COLORS: Record<string, string> = {
  fitness: '#10b981',
  nutrition: '#f59e0b',
  wellness: '#0ea5e9',
  discipline: '#a855f7',
};
