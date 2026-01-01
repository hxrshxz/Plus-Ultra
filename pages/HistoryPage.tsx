import React, { useState, useMemo } from 'react';
import { useHabitTracker } from '../context/HabitTrackerContext';
import { getISTDate, getDatesInMonth, getDayOfWeek, formatDateDisplayIST, getTodayIST } from '../utils/time';
import { BackArrowIcon, CheckIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';

// ============================================
// CALENDAR COMPONENT
// ============================================
const Calendar: React.FC<{
  year: number;
  month: number;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  getCompletionForDate: (date: string) => number;
}> = ({ year, month, selectedDate, onSelectDate, getCompletionForDate }) => {
  const dates = getDatesInMonth(year, month);
  const firstDayOfWeek = getDayOfWeek(dates[0]);
  const today = getTodayIST();

  // Create grid with empty cells for alignment
  const gridCells: (string | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...dates,
  ];

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-neutral-600 font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {gridCells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const completion = getCompletionForDate(date);
          const isSelected = date === selectedDate;
          const isToday = date === today;
          const isFuture = date > today;
          const dayNumber = parseInt(date.split('-')[2]);

          // Determine color based on completion
          const getCompletionColor = () => {
            if (isFuture) return 'bg-white/5';
            if (completion === 0) return 'bg-white/5';
            if (completion < 30) return 'bg-red-500/20';
            if (completion < 60) return 'bg-orange-500/30';
            if (completion < 80) return 'bg-yellow-500/40';
            if (completion < 100) return 'bg-green-500/50';
            return 'bg-green-500/70';
          };

          return (
            <button
              key={date}
              onClick={() => !isFuture && onSelectDate(date)}
              disabled={isFuture}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${getCompletionColor()} ${
                isSelected
                  ? 'ring-2 ring-amber-500 scale-105'
                  : 'hover:scale-105'
              } ${isToday ? 'border border-amber-500/50' : ''} ${
                isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <span
                className={`${
                  isToday ? 'text-amber-500' : isSelected ? 'text-white' : 'text-neutral-400'
                }`}
              >
                {dayNumber}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-neutral-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-white/5" />
          <span>0%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500/30" />
          <span>30%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/50" />
          <span>80%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/70" />
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DAY DETAIL COMPONENT
// ============================================
const DayDetail: React.FC<{ date: string }> = ({ date }) => {
  const { habits, getHabitLog, getDayCompletionPercentage } = useHabitTracker();
  const completion = getDayCompletionPercentage(date);

  return (
    <div className="glass-card rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-title">{formatDateDisplayIST(date)}</h3>
        <span
          className={`text-lg font-mono ${
            completion === 100
              ? 'text-green-500'
              : completion >= 80
              ? 'text-yellow-500'
              : 'text-neutral-500'
          }`}
        >
          {Math.round(completion)}%
        </span>
      </div>

      <div className="space-y-2">
        {habits.map((habit) => {
          const log = getHabitLog(habit.id, date);
          const isCompleted = log?.completed || false;

          return (
            <div
              key={habit.id}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{habit.emoji}</span>
                <span
                  className={`text-sm ${
                    isCompleted ? 'text-white' : 'text-neutral-500'
                  }`}
                >
                  {habit.name}
                </span>
              </div>
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// HISTORY PAGE
// ============================================
const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { getDayCompletionPercentage } = useHabitTracker();

  const now = getISTDate();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isCurrentMonth =
    currentMonth === now.getMonth() && currentYear === now.getFullYear();

  return (
    <div className="min-h-screen relative">
      {/* Ambient effects */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-40 right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 pt-4">
          <p className="text-purple-500 text-sm font-semibold uppercase tracking-[0.3em] mb-2 font-title">
            History
          </p>
          <h1 className="font-display text-4xl text-gradient-flow tracking-tight">
            📅 Your Journey
          </h1>
        </header>

        {/* Month Navigator */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="p-3 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <BackArrowIcon className="w-5 h-5" />
            </button>

            <div className="text-center">
              <p className="text-2xl font-light text-white">
                {monthNames[currentMonth]}
              </p>
              <p className="text-neutral-500 text-sm">{currentYear}</p>
            </div>

            <button
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
              className={`p-3 rounded-xl transition-all ${
                isCurrentMonth
                  ? 'bg-white/5 text-neutral-700 cursor-not-allowed'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <BackArrowIcon className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="glass-card rounded-3xl p-6">
          <Calendar
            year={currentYear}
            month={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            getCompletionForDate={getDayCompletionPercentage}
          />
        </div>

        {/* Day Detail */}
        {selectedDate && <DayDetail date={selectedDate} />}
      </div>
    </div>
  );
};

export default HistoryPage;
