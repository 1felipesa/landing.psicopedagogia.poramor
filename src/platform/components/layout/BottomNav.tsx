import React from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Wallet,
    User,
    Users,
    FileText,
    Activity,
    BookOpen
} from 'lucide-react';
import { User as UserType, UserRole } from '../../types';

interface BottomNavProps {
    currentUser: UserType | null;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentUser }) => {
    if (!currentUser) return null;

    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = currentUser.role === UserRole.ADMIN;

    const adminLinks = [
        { path: '/area-cliente/admin', label: 'Início', icon: LayoutDashboard },
        { path: '/area-cliente/admin/patients', label: 'Pacientes', icon: Users },
        { path: '/area-cliente/admin/schedule', label: 'Agenda', icon: Calendar },
        { path: '/area-cliente/admin/financial', label: 'Finanças', icon: Wallet },
        { path: '/area-cliente/admin/settings', label: 'Perfil', icon: User },
    ];

    const patientLinks = [
        { path: '/area-cliente/patient', label: 'Início', icon: LayoutDashboard },
        { path: '/area-cliente/patient/anamnesis', label: 'Anamnese', icon: FileText },
        { path: '/area-cliente/patient/library', label: 'Biblioteca', icon: BookOpen },
        { path: '/area-cliente/patient/financial', label: 'Financeiro', icon: Wallet },
        { path: '/area-cliente/patient/profile', label: 'Perfil', icon: User },
    ];

    const links = isAdmin ? adminLinks : patientLinks;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-outline-variant px-2 py-3 flex items-center justify-around z-40 md:hidden pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = link.path === '/area-cliente/admin' || link.path === '/area-cliente/patient'
                    ? location.pathname === link.path
                    : location.pathname.startsWith(link.path);

                return (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={`flex flex-col items-center gap-1 min-w-[64px] transition-all duration-200 ${isActive ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                    >
                        <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-container text-on-primary-container' : ''
                            }`}>
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-tight">
                            {link.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
