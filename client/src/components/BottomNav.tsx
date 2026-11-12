import React from 'react';
import { Sparkles, MessageSquare, Flame, User } from 'lucide-react';

type TabType = 'LANDING' | 'AUTH' | 'FEED' | 'BLOG' | 'CHAT' | 'PROFILE' | 'MATCHES' | 'STREAKS';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { tab: 'FEED' as TabType, label: 'FEED', icon: Sparkles },
    { tab: 'MATCHES' as TabType, label: 'MATCHES', icon: MessageSquare },
    { tab: 'STREAKS' as TabType, label: 'STREAKS', icon: Flame },
    { tab: 'PROFILE' as TabType, label: 'PROFILE', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-black max-w-md mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 font-modern font-extrabold text-[10px] uppercase tracking-wider transition-colors relative ${
                isActive ? 'text-[#E60023]' : 'text-black hover:text-[#E60023]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[3]' : 'stroke-2'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-full h-1.5 bg-[#E60023] shadow-max-black" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};