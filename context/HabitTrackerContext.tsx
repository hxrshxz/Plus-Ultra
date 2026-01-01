import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { Habit, HabitLog, DayLog, WeightLog, HabitTrackerContextType } from '../types';
import { DEFAULT_HABITS } from '../utils/habits';
import { getTodayIST, getDateDaysAgo } from '../utils/time';

// ============================================
// STORAGE KEYS
// ============================================
const STORAGE_KEY_LOGS = 'muscleUpDayLogs';
const STORAGE_KEY_HABITS = 'muscleUpHabits';
const STORAGE_KEY_WEIGHT = 'muscleUpWeightLogs';

// ============================================
// DEFAULT CONTEXT
// ============================================
const defaultContextValue: HabitTrackerContextType = {
  habits: DEFAULT_HABITS,
  dayLogs: [],
  weightLogs: [],
  isLoading: true,
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  reorderHabits: () => {},
  toggleHabit: () => {},
  updateHabitValue: () => {},
  getHabitLog: () => undefined,
  getDayLog: () => undefined,
  addWeightLog: () => {},
  deleteWeightLog: () => {},
  getLatestWeight: () => undefined,
  getStreak: () => 0,
  getBestStreak: () => 0,
  getCompletionRate: () => 0,
  getDayCompletionPercentage: () => 0,
  getTotalCompletedToday: () => 0,
};

const HabitTrackerContext = createContext<HabitTrackerContextType>(defaultContextValue);

// ============================================
// PROVIDER
// ============================================
export const HabitTrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Load habits
      const savedHabits = localStorage.getItem(STORAGE_KEY_HABITS);
      if (savedHabits) {
        const parsed = JSON.parse(savedHabits);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHabits(parsed);
        }
      }
      
      // Load day logs
      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed)) {
          setDayLogs(parsed);
        }
      }
      
      // Load weight logs
      const savedWeight = localStorage.getItem(STORAGE_KEY_WEIGHT);
      if (savedWeight) {
        const parsed = JSON.parse(savedWeight);
        if (Array.isArray(parsed)) {
          setWeightLogs(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    } finally {
      setIsLoading(false);
    }

    // Listen for storage changes (cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_LOGS && e.newValue) {
        try {
          setDayLogs(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === STORAGE_KEY_HABITS && e.newValue) {
        try {
          setHabits(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === STORAGE_KEY_WEIGHT && e.newValue) {
        try {
          setWeightLogs(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits to storage:', error);
      }
    }
  }, [habits, isLoading]);

  // Save day logs to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(dayLogs));
      } catch (error) {
        console.error('Failed to save day logs to storage:', error);
      }
    }
  }, [dayLogs, isLoading]);

  // Save weight logs to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY_WEIGHT, JSON.stringify(weightLogs));
      } catch (error) {
        console.error('Failed to save weight logs to storage:', error);
      }
    }
  }, [weightLogs, isLoading]);

  // ============================================
  // HABIT MANAGEMENT
  // ============================================
  
  const addHabit = useCallback((habitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id'>>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, []);

  const reorderHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
  }, []);

  // ============================================
  // HABIT LOG OPERATIONS
  // ============================================

  // Toggle a boolean habit
  const toggleHabit = useCallback((habitId: string, date: string) => {
    setDayLogs(prev => {
      const dayLogIndex = prev.findIndex(d => d.date === date);
      const now = Date.now();

      if (dayLogIndex === -1) {
        // Create new day log
        const newLog: HabitLog = {
          habitId,
          date,
          completed: true,
          updatedAt: now,
        };
        return [...prev, { date, logs: [newLog], createdAt: now }];
      }

      // Update existing day log
      const dayLog = prev[dayLogIndex];
      const logIndex = dayLog.logs.findIndex(l => l.habitId === habitId);

      if (logIndex === -1) {
        // Add new habit log
        const newLog: HabitLog = {
          habitId,
          date,
          completed: true,
          updatedAt: now,
        };
        const updatedDayLog = {
          ...dayLog,
          logs: [...dayLog.logs, newLog],
        };
        return [...prev.slice(0, dayLogIndex), updatedDayLog, ...prev.slice(dayLogIndex + 1)];
      }

      // Toggle existing habit log
      const existingLog = dayLog.logs[logIndex];
      const updatedLog = {
        ...existingLog,
        completed: !existingLog.completed,
        updatedAt: now,
      };
      const updatedLogs = [
        ...dayLog.logs.slice(0, logIndex),
        updatedLog,
        ...dayLog.logs.slice(logIndex + 1),
      ];
      const updatedDayLog = { ...dayLog, logs: updatedLogs };
      return [...prev.slice(0, dayLogIndex), updatedDayLog, ...prev.slice(dayLogIndex + 1)];
    });
  }, []);

  // Update habit value (for counter/duration types)
  const updateHabitValue = useCallback((habitId: string, date: string, value: number) => {
    const habit = habits.find(h => h.id === habitId);
    const isCompleted = habit?.target ? value >= habit.target : value > 0;

    setDayLogs(prev => {
      const dayLogIndex = prev.findIndex(d => d.date === date);
      const now = Date.now();

      if (dayLogIndex === -1) {
        const newLog: HabitLog = {
          habitId,
          date,
          completed: isCompleted,
          value,
          updatedAt: now,
        };
        return [...prev, { date, logs: [newLog], createdAt: now }];
      }

      const dayLog = prev[dayLogIndex];
      const logIndex = dayLog.logs.findIndex(l => l.habitId === habitId);

      if (logIndex === -1) {
        const newLog: HabitLog = {
          habitId,
          date,
          completed: isCompleted,
          value,
          updatedAt: now,
        };
        const updatedDayLog = {
          ...dayLog,
          logs: [...dayLog.logs, newLog],
        };
        return [...prev.slice(0, dayLogIndex), updatedDayLog, ...prev.slice(dayLogIndex + 1)];
      }

      const updatedLog = {
        ...dayLog.logs[logIndex],
        completed: isCompleted,
        value,
        updatedAt: now,
      };
      const updatedLogs = [
        ...dayLog.logs.slice(0, logIndex),
        updatedLog,
        ...dayLog.logs.slice(logIndex + 1),
      ];
      const updatedDayLog = { ...dayLog, logs: updatedLogs };
      return [...prev.slice(0, dayLogIndex), updatedDayLog, ...prev.slice(dayLogIndex + 1)];
    });
  }, [habits]);

  // ============================================
  // GETTERS
  // ============================================

  // Get a specific habit log
  const getHabitLog = useCallback((habitId: string, date: string): HabitLog | undefined => {
    const dayLog = dayLogs.find(d => d.date === date);
    return dayLog?.logs.find(l => l.habitId === habitId);
  }, [dayLogs]);

  // Get a day log
  const getDayLog = useCallback((date: string): DayLog | undefined => {
    return dayLogs.find(d => d.date === date);
  }, [dayLogs]);

  // ============================================
  // STATISTICS
  // ============================================

  // Calculate current streak for a habit
  const getStreak = useCallback((habitId: string): number => {
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const date = getDateDaysAgo(i);
      const log = getHabitLog(habitId, date);
      
      if (log?.completed) {
        streak++;
      } else if (i > 0) {
        // Don't break on today if not completed yet
        break;
      }
    }
    
    return streak;
  }, [getHabitLog]);

  // Calculate best streak ever for a habit
  const getBestStreak = useCallback((habitId: string): number => {
    let bestStreak = 0;
    let currentStreak = 0;
    
    // Look back 365 days
    const dates: string[] = [];
    for (let i = 364; i >= 0; i--) {
      dates.push(getDateDaysAgo(i));
    }
    
    for (const date of dates) {
      const log = getHabitLog(habitId, date);
      if (log?.completed) {
        currentStreak++;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
    
    return bestStreak;
  }, [getHabitLog]);

  // Calculate completion rate for a habit over N days
  const getCompletionRate = useCallback((habitId: string, days: number): number => {
    let completed = 0;
    
    for (let i = 0; i < days; i++) {
      const date = getDateDaysAgo(i);
      const log = getHabitLog(habitId, date);
      if (log?.completed) completed++;
    }
    
    return days > 0 ? (completed / days) * 100 : 0;
  }, [getHabitLog]);

  // Get completion percentage for a specific day
  const getDayCompletionPercentage = useCallback((date: string): number => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return 0;
    
    const dayLog = getDayLog(date);
    if (!dayLog) return 0;
    
    const completed = dayLog.logs.filter(l => l.completed).length;
    return (completed / totalHabits) * 100;
  }, [habits, getDayLog]);

  // Get total habits completed today
  const getTotalCompletedToday = useCallback((): number => {
    const today = getTodayIST();
    const dayLog = getDayLog(today);
    return dayLog?.logs.filter(l => l.completed).length || 0;
  }, [getDayLog]);

  // ============================================
  // WEIGHT TRACKING
  // ============================================

  const addWeightLog = useCallback((weight: number, date?: string) => {
    const logDate = date || getTodayIST();
    const newLog: WeightLog = {
      id: crypto.randomUUID(),
      date: logDate,
      weight,
      updatedAt: Date.now(),
    };
    setWeightLogs(prev => [...prev, newLog].sort((a, b) => a.date.localeCompare(b.date)));
  }, []);

  const deleteWeightLog = useCallback((id: string) => {
    setWeightLogs(prev => prev.filter(log => log.id !== id));
  }, []);

  const getLatestWeight = useCallback((): WeightLog | undefined => {
    if (weightLogs.length === 0) return undefined;
    return weightLogs[weightLogs.length - 1];
  }, [weightLogs]);

  const value: HabitTrackerContextType = {
    habits,
    dayLogs,
    weightLogs,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleHabit,
    updateHabitValue,
    getHabitLog,
    getDayLog,
    addWeightLog,
    deleteWeightLog,
    getLatestWeight,
    getStreak,
    getBestStreak,
    getCompletionRate,
    getDayCompletionPercentage,
    getTotalCompletedToday,
  };

  return (
    <HabitTrackerContext.Provider value={value}>
      {children}
    </HabitTrackerContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================
export const useHabitTracker = (): HabitTrackerContextType => {
  return useContext(HabitTrackerContext);
};
