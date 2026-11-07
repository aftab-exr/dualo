import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sparkles, MessageSquare, Flame, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  // Hide BottomNav on full-screen chat rooms and auth screens
  if (
    location.pathname.startsWith('/chat/') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  const navItems = [
    { path: '/', label: 'Feed', icon: Sparkles },
    { path: '/matches', label: 'Matches', icon: MessageSquare },
    { path: '/streaks', label: 'Streaks', icon: Flame },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold transition-colors relative ${
                  isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};