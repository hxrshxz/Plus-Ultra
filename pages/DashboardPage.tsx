import React, { useMemo } from 'react';
import { useHabitTracker } from '../context/HabitTrackerContext';
import { getISTDate, getDateDaysAgo, getTodayIST } from '../utils/time';
import { FireIcon, BackArrowIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/habits';

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accentColor: string;
  glowColor: string;
}> = ({ title, value, subtext, icon, accentColor, glowColor }) => (
  <div className="group relative">
    <div
      className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"
      style={{ background: glowColor }}
    />
    <div className="relative glass-card rounded-3xl p-6 overflow-hidden transition-all duration-500 hover:scale-[1.02]">
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <div style={{ color: accentColor }}>{icon}</div>
      </div>
      <p className="text-neutral-500 text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-title">
        {title}
      </p>
      <p className="text-4xl font-medium text-white font-timer tracking-tight">{value}</p>
      {subtext && <p className="text-neutral-600 text-sm mt-2">{subtext}</p>}
    </div>
  </div>
);

// ============================================
// HABIT STREAK ROW
// ============================================
const HabitStreakRow: React.FC<{
  habit: { id: string; name: string; emoji: string; color: string };
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
}> = ({ habit, currentStreak, bestStreak, completionRate }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <span className="text-xl">{habit.emoji}</span>
      <span className="text-white text-sm">{habit.name}</span>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-center">
        <p className="text-amber-500 font-mono text-lg">{currentStreak}</p>
        <p className="text-neutral-600 text-xs">Current</p>
      </div>
      <div className="text-center">
        <p className="text-purple-500 font-mono text-lg">{bestStreak}</p>
        <p className="text-neutral-600 text-xs">Best</p>
      </div>
      <div className="text-center min-w-[50px]">
        <p className="text-green-500 font-mono text-lg">{Math.round(completionRate)}%</p>
        <p className="text-neutral-600 text-xs">7 days</p>
      </div>
    </div>
  </div>
);

// ============================================
// DASHBOARD PAGE
// ============================================
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    habits,
    getStreak,
    getBestStreak,
    getCompletionRate,
    getDayCompletionPercentage,
    getTotalCompletedToday,
    dayLogs,
  } = useHabitTracker();

  const today = getTodayIST();

  // Calculate dashboard stats
  const stats = useMemo(() => {
    // Overall completion rates
    const todayCompletion = getDayCompletionPercentage(today);
    const weeklyCompletion =
      Array.from({ length: 7 }, (_, i) => getDayCompletionPercentage(getDateDaysAgo(i))).reduce(
        (a, b) => a + b,
        0
      ) / 7;

    // Best streaks across all habits
    const allStreaks = habits.map((h) => ({
      habit: h,
      current: getStreak(h.id),
      best: getBestStreak(h.id),
      rate: getCompletionRate(h.id, 7),
    }));

    const bestCurrentStreak = Math.max(...allStreaks.map((s) => s.current), 0);
    const bestEverStreak = Math.max(...allStreaks.map((s) => s.best), 0);

    // Last 7 days chart data
    const weekChartData = Array.from({ length: 7 }, (_, i) => {
      const date = getDateDaysAgo(6 - i);
      const d = new Date(date + 'T00:00:00');
      return {
        name: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        completion: getDayCompletionPercentage(date),
        date,
      };
    });

    // Category breakdown
    const categoryData = ['fitness', 'nutrition', 'wellness', 'discipline'].map((cat) => {
      const categoryHabits = habits.filter((h) => h.category === cat);
      const avgRate =
        categoryHabits.length > 0
          ? categoryHabits.reduce((sum, h) => sum + getCompletionRate(h.id, 7), 0) /
            categoryHabits.length
          : 0;
      return {
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: avgRate,
        fill: CATEGORY_COLORS[cat],
      };
    });

    // Total active days
    const activeDays = dayLogs.filter((d) => {
      const completion = getDayCompletionPercentage(d.date);
      return completion > 0;
    }).length;

    return {
      todayCompletion,
      weeklyCompletion,
      bestCurrentStreak,
      bestEverStreak,
      weekChartData,
      categoryData,
      allStreaks,
      activeDays,
      totalCompleted: getTotalCompletedToday(),
    };
  }, [
    habits,
    getStreak,
    getBestStreak,
    getCompletionRate,
    getDayCompletionPercentage,
    getTotalCompletedToday,
    dayLogs,
    today,
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 pt-4">
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-[0.3em] mb-2 font-title">
            Analytics
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-gradient-flow tracking-tight">
            📊 Your Progress
          </h1>
          <p className="text-neutral-500 mt-2 text-lg font-title">
            Track your gains and stay consistent
          </p>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Today"
            value={`${Math.round(stats.todayCompletion)}%`}
            subtext={`${stats.totalCompleted}/${habits.length} habits`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clipRule="evenodd"
                />
              </svg>
            }
            accentColor="#f59e0b"
            glowColor="rgba(245, 158, 11, 0.15)"
          />
          <StatCard
            title="This Week"
            value={`${Math.round(stats.weeklyCompletion)}%`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                <path
                  fillRule="evenodd"
                  d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            }
            accentColor="#6366f1"
            glowColor="rgba(99, 102, 241, 0.15)"
          />
          <StatCard
            title="Current Streak"
            value={stats.bestCurrentStreak}
            subtext="days"
            icon={<FireIcon className="w-6 h-6" />}
            accentColor="#f97316"
            glowColor="rgba(249, 115, 22, 0.15)"
          />
          <StatCard
            title="Best Streak"
            value={stats.bestEverStreak}
            subtext="days ever"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744z"
                  clipRule="evenodd"
                />
              </svg>
            }
            accentColor="#8b5cf6"
            glowColor="rgba(139, 92, 246, 0.15)"
          />
        </div>

        {/* Weekly Chart */}
        <div className="glass-card rounded-3xl p-6 mb-8">
          <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-1">
            Weekly Overview
          </h2>
          <p className="text-2xl font-light text-white mb-6">Last 7 Days</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weekChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.3)"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card rounded-xl p-4 border border-amber-500/30">
                          <p className="text-amber-500 font-semibold text-sm mb-1">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-white text-2xl font-mono">
                            {Math.round(payload[0].value as number)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completion"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fill="url(#colorCompletion)"
                  dot={false}
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown & Habit Streaks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-1">
              Categories
            </h2>
            <p className="text-xl font-light text-white mb-6">7-Day Average</p>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryData} layout="vertical" margin={{ left: 0, right: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card rounded-xl p-3 border border-purple-500/30">
                            <p className="text-white font-mono">
                              {Math.round(payload[0].value as number)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Habit Streaks */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-1">
              Habit Streaks
            </h2>
            <p className="text-xl font-light text-white mb-4">Individual Progress</p>

            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
              {stats.allStreaks
                .sort((a, b) => b.current - a.current)
                .slice(0, 6)
                .map(({ habit, current, best, rate }) => (
                  <HabitStreakRow
                    key={habit.id}
                    habit={habit}
                    currentStreak={current}
                    bestStreak={best}
                    completionRate={rate}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 glass-card rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-neutral-600 text-xs uppercase tracking-wider">Active Days</p>
              <p className="text-white font-mono text-lg">{stats.activeDays}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-neutral-600 text-xs uppercase tracking-wider">Total Habits</p>
              <p className="text-white font-mono text-lg">{habits.length}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-neutral-600 text-xs uppercase tracking-wider">Timezone</p>
              <p className="text-amber-500 font-mono text-lg">IST (UTC+5:30)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
