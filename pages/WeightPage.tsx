import React, { useState, useMemo } from 'react';
import { useHabitTracker } from '../context/HabitTrackerContext';
import { getTodayIST } from '../utils/time';
import { PlusIcon, CheckIcon } from '../components/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';

// ============================================
// WEIGHT PAGE
// ============================================
const WeightPage: React.FC = () => {
  const { weightLogs, addWeightLog, deleteWeightLog, getLatestWeight } = useHabitTracker();
  const [weight, setWeight] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const today = getTodayIST();

  // Calculate stats
  const stats = useMemo(() => {
    if (weightLogs.length === 0) {
      return { current: null, starting: null, change: 0, entries: 0, trend: 'neutral' };
    }

    const sorted = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
    const starting = sorted[0].weight;
    const current = sorted[sorted.length - 1].weight;
    const change = current - starting;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

    return {
      current,
      starting,
      change,
      entries: weightLogs.length,
      trend,
    };
  }, [weightLogs]);

  // Chart data - sorted by date
  const chartData = useMemo(() => {
    return [...weightLogs]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-20) // Show last 20 entries
      .map((log) => ({
        date: new Date(log.date + 'T00:00:00').toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
        }),
        weight: log.weight,
        fullDate: log.date,
      }));
  }, [weightLogs]);

  // Recent entries - sorted by date descending
  const recentEntries = useMemo(() => {
    return [...weightLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }, [weightLogs]);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) return;
    
    addWeightLog(weightValue, today);
    setWeight('');
  };

  const handleDelete = (id: string) => {
    deleteWeightLog(id);
    setShowDeleteConfirm(null);
  };

  const latestWeight = getLatestWeight();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient effects */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 pt-4">
          <p className="text-emerald-500 text-sm font-semibold uppercase tracking-[0.3em] mb-2 font-title">
            Weekly Tracking
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-gradient-flow tracking-tight">
            ⚖️ Weight Log
          </h1>
          <p className="text-neutral-500 mt-2 text-lg font-title">
            Track your weight journey
          </p>
        </header>

        {/* Current Weight Display */}
        <div className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-60"
            style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }}
          />
          <div className="text-center">
            <p className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-2 font-title">
              Current Weight
            </p>
            {latestWeight ? (
              <>
                <p className="text-6xl lg:text-7xl font-medium text-white font-timer tracking-tight">
                  {latestWeight.weight.toFixed(1)}
                  <span className="text-2xl text-neutral-500 ml-2">kg</span>
                </p>
                <p className="text-neutral-600 text-sm mt-2">
                  Last logged: {new Date(latestWeight.date + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </>
            ) : (
              <p className="text-3xl text-neutral-600">No entries yet</p>
            )}
          </div>

          {/* Stats Row */}
          {stats.entries > 0 && (
            <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-white/5">
              <div className="text-center">
                <p className="text-neutral-600 text-xs uppercase tracking-wider mb-1">Starting</p>
                <p className="text-white font-mono text-lg">{stats.starting?.toFixed(1)} kg</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-neutral-600 text-xs uppercase tracking-wider mb-1">Change</p>
                <p className={`font-mono text-lg ${
                  stats.change > 0 ? 'text-red-400' : stats.change < 0 ? 'text-emerald-400' : 'text-neutral-400'
                }`}>
                  {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)} kg
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-neutral-600 text-xs uppercase tracking-wider mb-1">Entries</p>
                <p className="text-white font-mono text-lg">{stats.entries}</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Weight Form */}
        <form onSubmit={handleAddWeight} className="glass-card rounded-2xl p-4 mb-6 flex gap-4">
          <div className="flex-1 relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              step="0.1"
              min="20"
              max="300"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-all text-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">kg</span>
          </div>
          <button
            type="submit"
            disabled={!weight || parseFloat(weight) <= 0}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
              weight && parseFloat(weight) > 0
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-neutral-600 cursor-not-allowed'
            }`}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Log Weight</span>
          </button>
        </form>

        {/* Weight Chart */}
        {chartData.length > 1 && (
          <div className="glass-card rounded-3xl p-6 mb-6">
            <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-1">
              Weight Trend
            </h2>
            <p className="text-2xl font-light text-white mb-6">Your Progress</p>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="date"
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
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card rounded-xl p-4 border border-emerald-500/30">
                            <p className="text-emerald-500 font-semibold text-sm mb-1">
                              {payload[0].payload.date}
                            </p>
                            <p className="text-white text-2xl font-mono">
                              {(payload[0].value as number).toFixed(1)} kg
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorWeight)"
                    dot={false}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-1">
              History
            </h2>
            <p className="text-xl font-light text-white mb-4">Recent Entries</p>

            <div className="space-y-2">
              {recentEntries.map((entry, index) => {
                const prevEntry = recentEntries[index + 1];
                const diff = prevEntry ? entry.weight - prevEntry.weight : 0;
                const isToday = entry.date === today;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all ${
                      isToday ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-white font-mono text-lg">{entry.weight.toFixed(1)}</p>
                        <p className="text-neutral-600 text-xs">kg</p>
                      </div>
                      <div>
                        <p className="text-neutral-400 text-sm">
                          {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        {isToday && (
                          <span className="text-emerald-500 text-xs font-medium">Today</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {prevEntry && (
                        <span className={`text-sm font-mono ${
                          diff > 0 ? 'text-red-400' : diff < 0 ? 'text-emerald-400' : 'text-neutral-500'
                        }`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                        </span>
                      )}
                      
                      {showDeleteConfirm === entry.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="p-2 rounded-xl text-neutral-500 hover:bg-white/10 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(entry.id)}
                          className="p-2 rounded-xl text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {weightLogs.length === 0 && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-4xl">
              ⚖️
            </div>
            <p className="text-neutral-400 text-lg mb-2">No weight entries yet</p>
            <p className="text-neutral-600 text-sm">
              Log your weight above to start tracking your progress
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightPage;
