import React, { useState, useEffect } from 'react';
import { getRandomQuote, motivationalQuotes, Quote } from '../utils/quotes';

// ============================================
// QUOTE CARD COMPONENT
// ============================================
const QuoteCard: React.FC<{ quote: Quote; index: number }> = ({ quote, index }) => (
  <div
    className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
    style={{
      animationDelay: `${index * 0.1}s`,
      animation: 'fadeSlideUp 0.5s ease-out forwards',
      opacity: 0,
    }}
  >
    <p className="text-white text-lg leading-relaxed italic mb-4">"{quote.text}"</p>
    <p className="text-amber-500 font-semibold">— {quote.author}</p>
  </div>
);

// ============================================
// MOTIVATION PAGE
// ============================================
const MotivationPage: React.FC = () => {
  const [featuredQuote, setFeaturedQuote] = useState<Quote>(getRandomQuote());

  // Refresh featured quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedQuote(getRandomQuote());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Get a random selection of quotes (exclude the featured one)
  const otherQuotes = motivationalQuotes
    .filter((q) => q.text !== featuredQuote.text)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  return (
    <div className="min-h-screen relative">
      {/* Ambient effects */}
      <div className="fixed top-20 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-40 left-10 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 pt-4 text-center">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-[0.3em] mb-2 font-title">
            Motivation
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-gradient-flow tracking-tight text-float">
            🔥 Get Fired Up
          </h1>
          <p className="text-neutral-500 mt-3 text-lg font-title">
            Words from legends who built greatness
          </p>
        </header>

        {/* Featured Quote */}
        <div className="relative mb-10">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl" />
          <div className="relative glass-card rounded-3xl p-8 lg:p-12 text-center overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />

            <div className="relative">
              <div className="text-6xl mb-6">💪</div>
              <p className="text-white text-2xl lg:text-3xl leading-relaxed font-light italic mb-6 animate-fadeIn">
                "{featuredQuote.text}"
              </p>
              <p className="text-amber-500 text-xl font-semibold">— {featuredQuote.author}</p>

              <button
                onClick={() => setFeaturedQuote(getRandomQuote())}
                className="mt-8 px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                🔄 New Quote
              </button>
            </div>
          </div>
        </div>

        {/* Workout Mantras */}
        <div className="glass-card rounded-3xl p-6 mb-8">
          <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-4 font-title">
            💥 Workout Mantras
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { emoji: '🏋️', text: 'LIGHTWEIGHT!' },
              { emoji: '💪', text: 'ONE MORE REP' },
              { emoji: '🔥', text: 'NO EXCUSES' },
              { emoji: '⚡', text: 'BEAST MODE' },
              { emoji: '🎯', text: 'STAY HUNGRY' },
              { emoji: '🦁', text: 'BE A LION' },
              { emoji: '💎', text: 'EARN IT' },
              { emoji: '🚀', text: 'LEVEL UP' },
            ].map((mantra, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default"
              >
                <div className="text-2xl mb-1">{mantra.emoji}</div>
                <p className="text-white font-impact text-sm tracking-wider">{mantra.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* More Quotes Grid */}
        <div>
          <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-4 font-title">
            📜 More Wisdom
          </h2>
          <div className="space-y-4">
            {otherQuotes.map((quote, index) => (
              <QuoteCard key={index} quote={quote} index={index} />
            ))}
          </div>
        </div>

        {/* Motivation Tips */}
        <div className="mt-10 glass-card rounded-3xl p-6">
          <h2 className="text-neutral-500 text-sm font-semibold uppercase tracking-[0.2em] mb-4 font-title">
            🧠 Mental Game Tips
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Discipline > Motivation',
                text: "Motivation is fleeting. Build systems and habits that don't rely on feeling like it.",
              },
              {
                title: 'Embrace the Suck',
                text: "Growth happens in discomfort. When it's hard, you're on the right path.",
              },
              {
                title: 'One Percent Better',
                text: 'Focus on tiny improvements daily. 1% better every day = 37x better in a year.',
              },
              {
                title: 'Never Zero',
                text: "Bad days happen. Do something small, even if it's just stretching. Never have a zero day.",
              },
            ].map((tip, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500 font-mono text-sm">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{tip.title}</h3>
                  <p className="text-neutral-500 text-sm">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationPage;
