// ============================================
// IST TIME UTILITIES
// ============================================

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds

/**
 * Get current date in IST timezone
 */
export const getISTDate = (): Date => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + IST_OFFSET_MS);
};

/**
 * Convert any date to IST
 */
export const toISTDate = (date: Date): Date => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + IST_OFFSET_MS);
};

/**
 * Get today's date in YYYY-MM-DD format (IST)
 */
export const getTodayIST = (): string => {
  const ist = getISTDate();
  return `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, '0')}-${String(ist.getDate()).padStart(2, '0')}`;
};

/**
 * Check if a date string is today (IST)
 */
export const isTodayIST = (dateStr: string): boolean => {
  return dateStr === getTodayIST();
};

/**
 * Format date for display (IST)
 */
export const formatDateDisplayIST = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const ist = toISTDate(date);
  
  const today = getTodayIST();
  const yesterday = new Date(getISTDate());
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  
  if (dateStr === today) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';
  
  return ist.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short' 
  });
};

/**
 * Get date string for N days ago (IST)
 */
export const getDateDaysAgo = (days: number): string => {
  const date = getISTDate();
  date.setDate(date.getDate() - days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Get all dates in a month (for calendar view)
 */
export const getDatesInMonth = (year: number, month: number): string[] => {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  
  return dates;
};

/**
 * Get the day of week (0 = Sunday, 6 = Saturday)
 */
export const getDayOfWeek = (dateStr: string): number => {
  return new Date(dateStr + 'T00:00:00').getDay();
};
