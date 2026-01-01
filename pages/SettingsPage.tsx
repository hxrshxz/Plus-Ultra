import React, { useState } from 'react';
import { useHabitTracker } from '../context/HabitTrackerContext';
import { Habit, HabitType, HabitCategory } from '../types';
import { BackArrowIcon, PlusIcon, CheckIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/habits';

// ============================================
// EMOJI PICKER (Simple grid)
// ============================================
const EMOJI_OPTIONS = [
  '🏋️', '🥊', '🏃', '🧘', '🚴', '🏊', '⚽', '🎾',
  '💪', '🔥', '⚡', '🎯', '🏆', '🥇', '💎', '🚀',
  '💊', '🥤', '💧', '🥗', '🍎', '🥦', '🍳', '🥛',
  '😴', '🧠', '📚', '✍️', '🎮', '📱', '🚫', '📵',
  '☀️', '🌙', '⏰', '🗓️', '✅', '❤️', '🙏', '🧘‍♂️',
];

const COLOR_OPTIONS = [
  '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#a855f7',
  '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#14b8a6',
  '#10b981', '#22c55e', '#84cc16', '#eab308', '#78716c',
];

// ============================================
// HABIT FORM COMPONENT
// ============================================
const HabitForm: React.FC<{
  habit?: Habit;
  onSave: (data: Omit<Habit, 'id'>) => void;
  onCancel: () => void;
}> = ({ habit, onSave, onCancel }) => {
  const [name, setName] = useState(habit?.name || '');
  const [emoji, setEmoji] = useState(habit?.emoji || '💪');
  const [type, setType] = useState<HabitType>(habit?.type || 'boolean');
  const [category, setCategory] = useState<HabitCategory>(habit?.category || 'fitness');
  const [target, setTarget] = useState(habit?.target?.toString() || '');
  const [unit, setUnit] = useState(habit?.unit || '');
  const [color, setColor] = useState(habit?.color || '#f59e0b');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      emoji,
      type,
      category,
      color,
      ...(type === 'counter' || type === 'duration'
        ? { target: target ? parseInt(target) : undefined, unit: unit || undefined }
        : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Emoji */}
      <div className="flex gap-4">
        {/* Emoji Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl hover:bg-white/10 transition-all"
          >
            {emoji}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-20 left-0 z-50 glass-card rounded-2xl p-3 grid grid-cols-8 gap-1 w-72">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setEmoji(e);
                    setShowEmojiPicker(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-xl hover:bg-white/10 rounded-lg transition-all"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Name Input */}
        <div className="flex-1">
          <label className="text-neutral-500 text-sm block mb-2">Habit Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Run"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="text-neutral-500 text-sm block mb-2">Type</label>
        <div className="flex gap-2">
          {(['boolean', 'counter'] as HabitType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                type === t
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  : 'bg-white/5 text-neutral-500 border border-white/10 hover:text-white'
              }`}
            >
              {t === 'boolean' ? '✓ Yes/No' : '🔢 Counter'}
            </button>
          ))}
        </div>
      </div>

      {/* Target & Unit (for counter type) */}
      {type === 'counter' && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-neutral-500 text-sm block mb-2">Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="8"
              min="1"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="text-neutral-500 text-sm block mb-2">Unit</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="glasses"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <label className="text-neutral-500 text-sm block mb-2">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {(['fitness', 'nutrition', 'wellness', 'discipline'] as HabitCategory[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                category === c
                  ? 'text-white border'
                  : 'bg-white/5 text-neutral-500 border border-white/10 hover:text-white'
              }`}
              style={{
                backgroundColor: category === c ? CATEGORY_COLORS[c] + '30' : undefined,
                borderColor: category === c ? CATEGORY_COLORS[c] : undefined,
                color: category === c ? CATEGORY_COLORS[c] : undefined,
              }}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-neutral-500 text-sm block mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-all ${
                color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-white/5 text-neutral-400 font-medium hover:bg-white/10 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            name.trim()
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'bg-white/5 text-neutral-600 cursor-not-allowed'
          }`}
        >
          {habit ? 'Save Changes' : 'Add Habit'}
        </button>
      </div>
    </form>
  );
};

// ============================================
// HABIT LIST ITEM
// ============================================
const HabitListItem: React.FC<{
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ habit, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: habit.color + '20', border: `1px solid ${habit.color}30` }}
        >
          {habit.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{habit.name}</h3>
          <p className="text-neutral-500 text-sm" style={{ color: habit.color }}>
            {CATEGORY_LABELS[habit.category]}
            {habit.type === 'counter' && habit.target && ` • ${habit.target} ${habit.unit || ''}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 rounded-xl text-neutral-500 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>

        {showConfirm ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onDelete();
                setShowConfirm(false);
              }}
              className="p-2 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="p-2 rounded-xl text-neutral-500 hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// SETTINGS PAGE
// ============================================
const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { habits, addHabit, updateHabit, deleteHabit } = useHabitTracker();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleSave = (data: Omit<Habit, 'id'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  // Group habits by category
  const categories = ['fitness', 'nutrition', 'wellness', 'discipline'] as const;

  return (
    <div className="min-h-screen relative">
      {/* Ambient effects */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-40 left-20 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 pt-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/today')}
              className="p-3 rounded-xl glass-card text-neutral-400 hover:text-white transition-all"
            >
              <BackArrowIcon className="w-5 h-5" />
            </button>
            <div>
              <p className="text-purple-500 text-sm font-semibold uppercase tracking-[0.3em] font-title">
                Settings
              </p>
              <h1 className="font-display text-3xl text-gradient-flow tracking-tight">
                ⚙️ Manage Habits
              </h1>
            </div>
          </div>
          <p className="text-neutral-500">
            Add, edit, or remove habits to customize your tracking.
          </p>
        </header>

        {/* Add/Edit Form */}
        {showForm ? (
          <div className="glass-card rounded-3xl p-6 mb-6">
            <h2 className="text-white text-xl font-medium mb-6">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h2>
            <HabitForm
              habit={editingHabit || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full glass-card rounded-2xl p-4 mb-6 flex items-center justify-center gap-3 text-amber-500 hover:bg-amber-500/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusIcon className="w-5 h-5" />
            </div>
            <span className="font-medium">Add New Habit</span>
          </button>
        )}

        {/* Habits List by Category */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryHabits = habits.filter((h) => h.category === category);
            if (categoryHabits.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-neutral-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3 font-title">
                  {CATEGORY_LABELS[category]} ({categoryHabits.length})
                </h2>
                <div className="space-y-2">
                  {categoryHabits.map((habit) => (
                    <HabitListItem
                      key={habit.id}
                      habit={habit}
                      onEdit={() => handleEdit(habit)}
                      onDelete={() => deleteHabit(habit.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {habits.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center text-4xl">
              🏋️
            </div>
            <p className="text-neutral-500 text-lg">No habits yet</p>
            <p className="text-neutral-600 text-sm mt-1">
              Add your first habit to start tracking
            </p>
          </div>
        )}

        {/* Total Count */}
        {habits.length > 0 && (
          <div className="mt-8 text-center text-neutral-600 text-sm">
            {habits.length} habit{habits.length !== 1 ? 's' : ''} total
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
