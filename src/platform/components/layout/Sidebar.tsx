import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  FileText,
  Activity,
  User as UserIcon,
  Heart,
  Wallet,
  BookOpen
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../../types';
import Avatar from '../ui/Avatar';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  onLogout,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = currentUser.role === UserRole.ADMIN;

  const adminLinks = [
    { path: '/area-cliente/admin', label: 'Início', icon: LayoutDashboard },
    { path: '/area-cliente/admin/patients', label: 'Pacientes', icon: Users },
    { path: '/area-cliente/admin/schedule', label: 'Agenda', icon: Calendar },
    { path: '/area-cliente/admin/financial', label: 'Financeiro', icon: Wallet },
    { path: '/area-cliente/admin/settings', label: 'Perfil', icon: Settings },
  ];

  const patientLinks = [
    { path: '/area-cliente/patient', label: 'Início', icon: LayoutDashboard },
    { path: '/area-cliente/patient/anamnesis', label: 'Anamnese', icon: FileText },
    { path: '/area-cliente/patient/library', label: 'Biblioteca', icon: BookOpen },
    { path: '/area-cliente/patient/reports', label: 'Documentos', icon: Activity },
    { path: '/area-cliente/patient/financial', label: 'Financeiro', icon: Wallet },
    { path: '/area-cliente/patient/profile', label: 'Perfil', icon: UserIcon },
  ];

  const links = isAdmin ? adminLinks : patientLinks;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Navigation Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-[300px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transform transition-transform duration-300 ease-in-out
        hidden md:flex md:translate-x-0 md:static md:h-screen flex-col rounded-e-3xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="flex flex-col gap-3 px-7 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-md3-1 flex-shrink-0">
              <Heart size={22} fill="currentColor" />
            </div>
            <h1 className="font-bold text-slate-800 dark:text-white text-lg leading-tight tracking-tight">Psicopedagogia por Amor</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pl-1">Plataforma de gestão em Psicopedagogia</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2">
          {links.map((link) => {
            const Icon = link.icon;
            // Check if current path starts with link path (for nested routes)
            // But handle root paths carefully to avoid everything matching '/'
            const isActive = link.path === '/area-cliente/admin' || link.path === '/area-cliente/patient'
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path);

            return (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`
                  w-full flex items-center gap-3 px-6 py-4 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary-700 dark:text-primary-400' : 'text-slate-500 dark:text-slate-500'} />
                <span className="tracking-wide">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Mini Profile & Footer */}
        <div className="p-4 mt-auto">
          <div className="bg-white/50 dark:bg-slate-800/40 rounded-3xl p-4 mb-2 border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-4 transition-colors">
              <Avatar name={currentUser.name} />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate transition-colors">{currentUser.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
                  {isAdmin ? 'Psicopedagoga' : 'Paciente'}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all border border-transparent dark:border-slate-700/50 hover:border-red-100 dark:hover:border-red-900/30"
            >
              <LogOut size={18} />
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;