import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { HomeIcon, CalendarIcon, ChartIcon, SparklesIcon, ScaleIcon } from './icons';

const Layout: React.FC = () => {
  const navItems = [
    { to: '/today', icon: HomeIcon, label: 'Today' },
    { to: '/history', icon: CalendarIcon, label: 'History' },
    { to: '/weight', icon: ScaleIcon, label: 'Weight' },
    { to: '/dashboard', icon: ChartIcon, label: 'Stats' },
    { to: '/motivation', icon: SparklesIcon, label: 'Fuel' },
  ];

  return (
    <div className="min-h-screen animated-bg relative">
      {/* Ambient glow effects */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Main content */}
      <main className="pb-24 relative z-10">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto px-4 pb-4">
          <div className="glass-card rounded-2xl p-2 flex justify-around items-center">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'text-neutral-500 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
