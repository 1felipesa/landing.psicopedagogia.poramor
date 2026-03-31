import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import { User } from '../../types';

interface DashboardLayoutProps {
    currentUser: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentUser }) => {
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = (pathname: string) => {
        if (pathname.includes('/area-cliente/admin/patients')) return 'Pacientes';
        if (pathname.includes('/area-cliente/admin/schedule')) return 'Agenda';
        if (pathname.includes('/area-cliente/admin/status') || pathname.includes('/area-cliente/admin/financial')) return 'Financeiro';
        if (pathname.includes('/area-cliente/admin/settings')) return 'Perfil';
        if (pathname === '/area-cliente/admin') return 'Início';

        if (pathname.includes('/area-cliente/patient/anamnesis')) return 'Anamnese';
        if (pathname.includes('/area-cliente/patient/reports')) return 'Meus Relatórios';
        if (pathname.includes('/area-cliente/patient/financial')) return 'Financeiro';
        if (pathname.includes('/area-cliente/patient/profile')) return 'Perfil';
        if (pathname === '/area-cliente/patient') return 'Início';

        return 'Psicopedagogia por Amor';
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
            <Sidebar
                currentUser={currentUser}
                onLogout={logout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <TopNav
                    onMenuClick={() => setIsSidebarOpen(true)}
                    title={getPageTitle(location.pathname)}
                    userName={currentUser.name}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
                    <Outlet />
                </main>

                <BottomNav currentUser={currentUser} />
            </div>
        </div>
    );
};

export default DashboardLayout;
