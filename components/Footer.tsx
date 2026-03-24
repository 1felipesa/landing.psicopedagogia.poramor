
import React from 'react';

const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center gap-8 mb-12 w-full">

          {/* Logo and Brand Section */}
          <div className="flex flex-col items-center max-w-md">
            <div className="flex items-center gap-2 mb-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-lsp-purple/10 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-lsp-purple" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight font-brand text-left">
                <span className="text-2xl text-lsp-purple font-black tracking-tight">Psicopedagogia</span>
                <span className="font-black text-xs text-slate-900 -mt-1 uppercase tracking-tighter">por Amor</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Acreditamos que todo aprendiz pode desbravar seu próprio caminho. Práticas Baseadas em Evidências para um aprendizado significativo e autônomo.
            </p>
            {/* Social Links */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-2 w-full px-4">
              <a
                href="https://www.instagram.com/psicopedagogia.poramor/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group/social w-full sm:w-auto"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/social:rotate-12 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                <span className="font-black text-xs uppercase tracking-widest">Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/@psicopedagogia.poramor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-3 bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group/social w-full sm:w-auto"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/social:scale-110 transition-transform"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                <span className="font-black text-xs uppercase tracking-widest">YouTube</span>
              </a>
            </div>
          </div>

          {/* Info Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full max-w-4xl border-t border-slate-50 pt-12">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6 bg-slate-100 px-3 py-1 rounded-full">Contatos</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 group">
                  <a href="tel:+5516991864393" className="flex items-center gap-3 group hover:text-green-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-green-600 transition-colors">(16) 99186-4393</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <a href="mailto:psicopedagogia.poramor.2026@gmail.com" className="flex items-center gap-3 group hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors px-2 break-all sm:break-normal">psicopedagogia.poramor.2026@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-6 bg-slate-100 px-3 py-1 rounded-full">Explorar</h4>
              <ul className="flex flex-col gap-4">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-bold text-slate-500 hover:text-finn-blue transition-colors uppercase tracking-widest">Início</button></li>
                <li><button onClick={() => scrollToSection('sobre')} className="text-sm font-bold text-slate-500 hover:text-finn-blue transition-colors uppercase tracking-widest">A Guia</button></li>
                <li><button onClick={() => scrollToSection('servicos')} className="text-sm font-bold text-slate-500 hover:text-finn-blue transition-colors uppercase tracking-widest">Expedições</button></li>
                <li><button onClick={() => scrollToSection('area-cliente')} className="text-sm font-bold text-slate-500 hover:text-finn-blue transition-colors uppercase tracking-widest">Plataforma</button></li>
                <li><button onClick={() => scrollToSection('metodologia')} className="text-sm font-bold text-slate-500 hover:text-finn-blue transition-colors uppercase tracking-widest">Sinais</button></li>
                <li><button onClick={() => scrollToSection('conteudo')} className="text-sm font-bold text-slate-500 hover:text-finn-blue transition-colors uppercase tracking-widest">Conteúdo</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="text-sm font-bold text-slate-500 hover:text-finn-blue transition-colors uppercase tracking-widest">Dúvidas</button></li>
                <li><a href="https://psicopedagogiaporamor.vercel.app" className="text-sm font-bold text-lsp-purple hover:underline transition-colors uppercase tracking-widest">Acessar Área Cliente</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full pt-6 border-t border-slate-100 text-center">
          <div className="flex justify-center items-center gap-1.5 text-slate-900 text-xs font-medium mb-1">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-black">Psicopedagogia</span>
            <span className="font-black">por Amor</span>
            <span className="hidden sm:inline">- Raiane E. Ferreira</span>
          </div>
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-[0.2em] opacity-60">
            HERÓIS DA APRENDIZAGEM
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
