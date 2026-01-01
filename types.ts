// ============================================
// HABIT TYPES
// ============================================

export type HabitType = 
  | 'boolean'      // Yes/No (e.g., "Did you go to gym?")
  | 'counter'      // Count (e.g., "8 glasses of water")
  | 'duration';    // Time (e.g., "7 hours sleep")

export type HabitCategory = 'fitness' | 'nutrition' | 'wellness' | 'discipline';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  type: HabitType;
  target?: number;        // Target value for counter/duration
  unit?: string;          // "glasses", "hours", "mg", etc.
  category: HabitCategory;
  color: string;          // Accent color for the habit
}

// ============================================
// LOGGING TYPES
// ============================================

export interface HabitLog {
  habitId: string;
  date: string;           // YYYY-MM-DD format (IST)
  completed: boolean;
  value?: number;         // For counter/duration types
  notes?: string;
  updatedAt: number;      // Timestamp of last update
}

export interface DayLog {
  date: string;           // YYYY-MM-DD format
  logs: HabitLog[];
  createdAt: number;
}

// ============================================
// WEIGHT TRACKING TYPES
// ============================================

export interface WeightLog {
  id: string;
  date: string;           // YYYY-MM-DD format (IST)
  weight: number;         // Weight in kg
  updatedAt: number;      // Timestamp of entry
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface HabitTrackerContextType {
  habits: Habit[];
  dayLogs: DayLog[];
  weightLogs: WeightLog[];
  dailyGoal: number;           // Daily goal in number of habits to complete
  isLoading: boolean;
  
  // Habit Management
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (habits: Habit[]) => void;
  
  // Habit Log Operations
  toggleHabit: (habitId: string, date: string) => void;
  updateHabitValue: (habitId: string, date: string, value: number) => void;
  getHabitLog: (habitId: string, date: string) => HabitLog | undefined;
  getDayLog: (date: string) => DayLog | undefined;
  
  // Weight Tracking
  addWeightLog: (weight: number, date?: string) => void;
  deleteWeightLog: (id: string) => void;
  getLatestWeight: () => WeightLog | undefined;
  
  // Statistics
  getStreak: (habitId: string) => number;
  getBestStreak: (habitId: string) => number;
  getCompletionRate: (habitId: string, days: number) => number;
  getDayCompletionPercentage: (date: string) => number;
  getTotalCompletedToday: () => number;
  updateDailyGoal: (goal: number) => void;
}
