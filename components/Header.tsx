
import React from 'react';

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
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

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="bg-white/94 backdrop-blur-md w-full max-w-7xl rounded-full shadow-xl border border-slate-200/60 py-2.5 px-4 sm:px-8 flex items-center transition-all duration-300">
        <div className="flex items-center shrink-0">
          <div
            role="button"
            tabIndex={0}
            aria-label="Voltar ao início"
            className="flex items-center gap-3 group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-lsp-purple rounded-xl"
            onClick={() => {
              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(0, { duration: 1.5 });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo(0, { duration: 1.5 });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            }}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-lsp-purple/10 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-lsp-purple/20 group-hover:scale-110 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-lsp-purple sm:w-[24px] sm:h-[24px]" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight font-brand pr-4">
              <span className="text-lg sm:text-[22px] text-lsp-purple font-black tracking-tight">Psicopedagogia</span>
              <span className="font-black text-[9px] sm:text-[13px] text-slate-800 -mt-1 uppercase tracking-[0.2em]">por Amor</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Centered in available space */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 px-4">
          {[
            { label: 'A Guia', id: 'sobre' },
            { label: 'Expedições', id: 'servicos' },
            { label: 'Plataforma', id: 'area-cliente' },
            { label: 'Sinais', id: 'metodologia' },
            { label: 'Conteúdo', id: 'conteudo' },
            { label: 'Dúvidas', id: 'faq' }
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-[13px] font-bold text-slate-500 hover:text-lsp-purple transition-all hover:scale-105 uppercase tracking-widest whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end shrink-0 pl-4">
          <a
            href="https://psicopedagogiaporamor.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lsp-purple hover:bg-lsp-purple/90 text-white font-black py-2 px-4 sm:py-3 sm:px-7 rounded-full shadow-lg shadow-lsp-purple/20 hover:shadow-lsp-purple/40 active:scale-95 transition-all flex items-center gap-2 text-[11px] sm:text-sm uppercase tracking-wider shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:inline">Área do Cliente</span>
            <span className="sm:hidden">Entrar</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
