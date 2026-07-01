import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useTheme } from '../../hooks/useTheme';

interface TopNavProps {
  onMenuClick: () => void;
  title: string;
  userName: string;
}

const TopNav: React.FC<TopNavProps> = ({ onMenuClick, title, userName }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-outline-variant transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="hidden md:flex p-2 text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors md:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-on-surface tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 ml-2 border-l border-outline-variant pl-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-full transition-colors md3-ripple"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="hidden md:block text-right ml-2">
            <p className="text-sm font-bold text-on-surface leading-none">{userName}</p>
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mt-1">Online</p>
          </div>
          <Avatar name={userName} size="sm" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;