import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './landing/LandingPage';
import EbooksPage from './landing/EbooksPage';
import PrivacyPage from './landing/PrivacyPage';
import CookieBanner from './landing/components/CookieBanner';

// Lazy load Platform App to optimize bundle size
const PlatformApp = lazy(() => import('./platform/App'));

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const isClientArea = location.pathname.startsWith('/area-cliente');
    
    if (isClientArea) {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
      {/* 
        A rota da Área do Cliente. 
        O "/*" é importante para que o PlatformApp gerencie suas próprias sub-rotas (/admin, /patient, etc).
        Suspense é utilizado para envolver o componente lazy.
      */}
      <Route 
        path="/area-cliente/*" 
        element={
          <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-surface">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <PlatformApp />
          </Suspense>
        } 
      />
      <Route path="/ebooks" element={<EbooksPage />} />
      <Route path="/privacidade" element={<PrivacyPage />} />
      
      {/* 
        Qualquer outra rota cai na Landing Page. 
      */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
    <CookieBanner />
    </>
  );
};

export default App;
