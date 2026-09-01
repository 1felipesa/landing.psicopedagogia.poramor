import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Heart, Menu, X } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    const lenis = (window as any).lenis;

    if (element) {
      const headerOffset = 100;

      if (lenis) {
        lenis.scrollTo(element, {
          offset: -headerOffset,
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const navItems = [
    { label: 'Metodologia', id: 'metodologia', path: '/#metodologia' },
    { label: 'Sobre', id: 'sobre', path: '/#sobre' },
    { label: 'Dúvidas', id: 'faq', path: '/#faq' },
    { label: 'Planos', path: '/planos', isRoute: true },
    { label: 'E-books', path: '/ebooks', isRoute: true },
  ];

  const handleNavClick = (item: { label: string; id?: string; path: string; isRoute?: boolean }) => {
    setIsMobileMenuOpen(false);

    if (item.isRoute) {
      navigate(item.path);
      return;
    }

    if (item.id) {
      scrollToSection(item.id);
    }
  };

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex flex-col items-center px-4 sm:px-6 w-full pointer-events-none">
      <nav className="glass-premium w-full max-w-7xl rounded-pill shadow-premium border border-muted/20 py-2 sm:py-2.5 px-4 sm:px-8 flex items-center justify-between transition-all duration-300 pointer-events-auto relative z-50">
        <div className="flex items-center shrink-0">
          <div
            role="button"
            tabIndex={0}
            aria-label="Voltar ao início"
            className="flex items-center gap-3 group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (location.pathname !== '/') {
                navigate('/');
              } else if ((window as any).lenis) {
                (window as any).lenis.scrollTo(0, { duration: 1.5 });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary/5 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110 shrink-0">
              <Heart size={20} className="text-primary sm:w-[24px] sm:h-[24px] fill-primary/20" />
            </div>
            <div className="flex flex-col leading-tight pr-4">
              <span className="text-lg sm:text-[22px] text-primary font-display font-bold tracking-tight">Psicopedagogia</span>
              <span className="font-body font-bold text-[9px] sm:text-[11px] text-text/60 -mt-1 uppercase tracking-[0.2em]">por Amor</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 px-4">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavClick(item)}
              className={`text-[12px] font-body font-bold transition-colors uppercase tracking-widest whitespace-nowrap cursor-pointer ${
                item.isRoute && location.pathname === item.path
                  ? 'text-accent border-b-2 border-accent pb-0.5'
                  : 'text-text/70 hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end shrink-0 pl-4 gap-2 sm:gap-4">
          <a
            href="/area-cliente"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:bg-primary/5 font-bold py-2 px-3 sm:px-4 rounded-pill transition-all flex items-center gap-2 text-[11px] sm:text-sm uppercase tracking-wider shrink-0"
            aria-label="Portal do Cliente"
          >
            <User size={18} strokeWidth={2.5} />
            <span className="hidden md:inline">Portal do Cliente</span>
          </a>
          
          <button
            onClick={() => window.open('https://wa.me/5516991864393', '_blank')}
            className="bg-accent hover:bg-accent/90 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-pill shadow-premium transition-all text-[11px] sm:text-sm uppercase tracking-wider hidden lg:flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <WhatsAppIcon size={18} />
            Agendar Consulta
          </button>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button 
            className="lg:hidden p-2 text-primary hover:bg-primary/5 rounded-pill transition-colors flex items-center justify-center cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 top-0 bg-background/95 backdrop-blur-xl transition-all duration-300 lg:hidden flex flex-col pt-24 px-6 pb-12 overflow-y-auto pointer-events-auto z-40 ${
            isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
      >
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            {/* Links */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-2">Navegação Principal</span>
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(item)}
                    className="text-left font-display font-bold text-2xl text-primary py-4 border-b border-muted/30 hover:text-accent transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.label}</span>
                    {item.isRoute && location.pathname === item.path && (
                      <span className="text-xs uppercase bg-accent/10 text-accent font-bold px-2 py-1 rounded-pill">Ativo</span>
                    )}
                  </button>
                ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 mt-8">
                <a
                  href="/area-cliente"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-primary/5 text-primary border border-primary/20 font-bold py-4 px-6 rounded-pill flex items-center justify-center gap-3 w-full"
                >
                  <User size={20} className="text-primary"/>
                  Portal do Cliente Exclusivo
                </a>

                <button
                  onClick={() => {
                      window.open('https://wa.me/5516991864393', '_blank');
                      setIsMobileMenuOpen(false);
                  }}
                  className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-6 rounded-pill flex items-center justify-center gap-3 shadow-premium w-full cursor-pointer"
                >
                  <WhatsAppIcon size={20}/>
                  Agendar Consulta via WhatsApp
                </button>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
