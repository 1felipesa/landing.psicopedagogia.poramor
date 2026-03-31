import React from 'react';
import { Menu, Search } from 'lucide-react';
import Avatar from '../ui/Avatar';

interface TopNavProps {
  onMenuClick: () => void;
  title: string;
  userName: string;
}

const TopNav: React.FC<TopNavProps> = ({ onMenuClick, title, userName }) => {
  return (
    <header className="sticky top-0 z-10 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-transparent dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="hidden md:flex p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors md:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* MD3 Search Bar - Filled container */}
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 dark:text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Busca rápida..."
            className="pl-10 pr-4 py-2.5 bg-surface-variant/50 dark:bg-slate-800 border-none rounded-full text-sm text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:ring-0 focus:bg-surface-variant dark:focus:bg-slate-700 w-48 transition-all focus:w-64"
          />
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">{userName}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mt-1">Online</p>
          </div>
          <Avatar name={userName} size="sm" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;