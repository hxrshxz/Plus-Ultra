import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabitTracker } from '../context/HabitTrackerContext';
import { Habit } from '../types';
import { getTodayIST, formatDateDisplayIST, getISTDate } from '../utils/time';
import { CATEGORY_LABELS, getHabitsByCategory } from '../utils/habits';
import { getRandomQuote, Quote } from '../utils/quotes';
import { CheckIcon, PlusIcon, MinusIcon, FireIcon, SettingsIcon } from '../components/icons';

// ============================================
// HABIT CARD COMPONENT
// ============================================
const HabitCard: React.FC<{
  habit: Habit;
  date: string;
  index: number;
}> = ({ habit, date, index }) => {
  const { getHabitLog, toggleHabit, updateHabitValue } = useHabitTracker();
  const log = getHabitLog(habit.id, date);
  const isCompleted = log?.completed || false;
  const value = log?.value || 0;

  const handleToggle = () => {
    if (habit.type === 'boolean') {
      toggleHabit(habit.id, date);
    }
  };

  const handleIncrement = () => {
    updateHabitValue(habit.id, date, value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) {
      updateHabitValue(habit.id, date, value - 1);
    }
  };

  return (
    <div
      onClick={habit.type === 'boolean' ? handleToggle : undefined}
      className={`group relative glass-card rounded-2xl p-4 transition-all duration-500 ${
        habit.type === 'boolean' ? 'cursor-pointer hover:scale-[1.02]' : ''
      } ${isCompleted ? 'ring-2 shadow-lg' : ''}`}
      style={{
        animationDelay: `${index * 0.05}s`,
        animation: 'fadeSlideUp 0.5s ease-out forwards',
        opacity: 0,
        borderColor: isCompleted ? habit.color + '50' : undefined,
        boxShadow: isCompleted ? `0 0 30px ${habit.color}20` : undefined,
        ringColor: habit.color + '50',
      }}
    >
      {/* Glow effect when completed */}
      {isCompleted && (
        <div
          className="absolute -inset-1 rounded-2xl blur-xl -z-10 opacity-30"
          style={{ background: habit.color }}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Left side - Emoji and Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
              isCompleted ? 'scale-110' : ''
            }`}
            style={{
              background: isCompleted ? habit.color + '30' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isCompleted ? habit.color + '50' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {habit.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-title text-lg truncate transition-colors duration-300 ${
                isCompleted ? 'text-white' : 'text-neutral-400'
              }`}
            >
              {habit.name}
            </h3>
            {habit.type === 'counter' && habit.target && (
              <p className="text-xs text-neutral-600">
                {value}/{habit.target} {habit.unit}
              </p>
            )}
          </div>
        </div>

        {/* Right side - Action/Status */}
        {habit.type === 'boolean' ? (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isCompleted
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            {isCompleted && <CheckIcon className="w-5 h-5 text-white" />}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDecrement();
              }}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <MinusIcon className="w-4 h-4 text-neutral-400" />
            </button>
            <span
              className="font-mono text-xl w-8 text-center"
              style={{ color: isCompleted ? habit.color : 'white' }}
            >
              {value}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement();
              }}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              style={{
                background: value < (habit.target || 0) ? habit.color + '20' : undefined,
              }}
            >
              <PlusIcon className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// PROGRESS RING COMPONENT
// ============================================
const ProgressRing: React.FC<{
  progress: number;
  size: number;
  strokeWidth: number;
}> = ({ progress, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-white/5"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="transition-all duration-1000 ease-out"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="url(#progressGradient)"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))',
        }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ============================================
// LIVE CLOCK COMPONENT
// ============================================
const LiveClock: React.FC = () => {
  const [time, setTime] = useState(getISTDate());

  useEffect(() => {
    const interval = setInterval(() => setTime(getISTDate()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="ist-badge">🇮🇳 IST</div>
      <span className="font-mono text-neutral-400">
        {time.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </span>
    </div>
  );
};

// ============================================
// TODAY PAGE
// ============================================
const TodayPage: React.FC = () => {
  const navigate = useNavigate();
  const { habits, getDayCompletionPercentage, getTotalCompletedToday, getStreak } =
    useHabitTracker();
  const today = getTodayIST();
  const [quote, setQuote] = useState<Quote>(getRandomQuote());

  const completionPercentage = getDayCompletionPercentage(today);
  const totalCompleted = getTotalCompletedToday();
  const totalHabits = habits.length;

  // Get best current streak across all habits
  const bestCurrentStreak = Math.max(...habits.map((h) => getStreak(h.id)), 0);

  // Group habits by category
  const categories = ['fitness', 'nutrition', 'wellness', 'discipline'];

  // Refresh quote on mount
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Extra ambient effects */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-40 left-20 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-amber-500 text-sm font-semibold uppercase tracking-[0.3em] mb-2 font-title">
                {formatDateDisplayIST(today)}
              </p>
              <h1 className="font-display text-4xl text-gradient-flow tracking-tight text-float">
                Plus Ultra
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LiveClock />
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-xl glass-card text-neutral-400 hover:text-white transition-all"
                aria-label="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between">
            {/* Progress Ring */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProgressRing progress={completionPercentage} size={80} strokeWidth={8} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-mono text-white">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-neutral-500 text-sm">Today's Progress</p>
                <p className="text-white text-lg font-medium">
                  {totalCompleted}/{totalHabits} completed
                </p>
              </div>
            </div>

            {/* Streak */}
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <FireIcon className="w-6 h-6 text-orange-500" />
                <span className="text-3xl font-timer text-white">{bestCurrentStreak}</span>
              </div>
              <p className="text-neutral-500 text-sm">Best Streak</p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="glass-card rounded-2xl p-4 mb-6 text-center animate-fadeIn">
          <p className="text-neutral-300 italic text-sm">"{quote.text}"</p>
          <p className="text-amber-500 text-xs mt-2">— {quote.author}</p>
        </div>

        {/* Habits by Category */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryHabits = getHabitsByCategory(habits, category);
            if (categoryHabits.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-neutral-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3 font-title">
                  {CATEGORY_LABELS[category]}
                </h2>
                <div className="space-y-3">
                  {categoryHabits.map((habit, index) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      date={today}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TodayPage;
