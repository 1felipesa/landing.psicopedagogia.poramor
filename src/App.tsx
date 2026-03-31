
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './landing/LandingPage';
import PlatformApp from './platform/App';

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for Supabase Auth hash fragments (password recovery, social login, etc)
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('type=recovery') || hash.includes('error='))) {
      // Move to platform area where Supabase client can handle the hash
      navigate(`/area-cliente/${hash}`, { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      {/* 
        A rota da Área do Cliente. 
        O "/*" é importante para que o PlatformApp gerencie suas próprias sub-rotas (/admin, /patient, etc).
      */}
      <Route path="/area-cliente/*" element={<PlatformApp />} />
      
      {/* 
        Qualquer outra rota cai na Landing Page. 
      */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
