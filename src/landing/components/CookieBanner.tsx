import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já deu ou recusou o consentimento
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // 1.5 segundos de atraso
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);

    // Atualizar GTM Consent Mode V2
    const dataLayer = (window as any).dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    (window as any).gtag = (window as any).gtag || gtag;
    (window as any).gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });

    dataLayer.push({
      event: 'consent_granted',
      consent_type: 'all'
    });
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);

    // Atualizar GTM Consent Mode V2
    const dataLayer = (window as any).dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    (window as any).gtag = (window as any).gtag || gtag;
    (window as any).gtag('consent', 'update', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied'
    });

    dataLayer.push({
      event: 'consent_declined',
      consent_type: 'none'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-white/85 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-premium z-[9999] animate-float duration-300">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <ShieldCheck size={20} />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-display font-bold text-sm text-primary uppercase tracking-wide">
              Controle de Privacidade
            </h4>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-text/30 hover:text-text/60 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>
          
          <p className="text-xs text-text/75 font-body leading-relaxed mb-5">
            Valorizamos sua privacidade. Utilizamos cookies para analisar o tráfego do site e personalizar anúncios do Meta Pixel e Google Analytics. Ao clicar em "Aceitar Todos", você concorda com este uso. Veja mais em nossa <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Política de Privacidade</a>.
          </p>
          
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-pill text-xs font-bold text-text/60 border border-muted/15 hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
            >
              Recusar
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-pill text-xs font-bold shadow-premium active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              Aceitar Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
