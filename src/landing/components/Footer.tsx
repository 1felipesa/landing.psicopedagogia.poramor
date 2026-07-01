import React from 'react';
import { Phone, Mail, ArrowUp, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-primary border-t border-white/10 pt-24 pb-12 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group w-fit mx-auto lg:mx-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 shrink-0">
                <Heart size={24} className="text-white fill-white/20" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-white text-2xl sm:text-3xl tracking-tight transition-colors">
                  Psicopedagogia
                </span>
                <span className="font-body font-bold text-xs sm:text-sm text-white/70 uppercase tracking-[0.25em] -mt-0.5">
                  por Amor
                </span>
              </div>
            </div>
            
            <p className="text-white/60 font-body text-base leading-relaxed max-w-sm">
              Potencializando o aprendizado através de intervenções científicas e acolhimento especializado. Uma jornada de descobertas e conquistas.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mx-auto lg:mx-0 w-fit">
              <a 
                href="https://www.instagram.com/psicopedagogia.poramor/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-sm hover:bg-white hover:text-primary transition-all transform hover:-translate-y-1 cursor-pointer group"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current transition-colors text-white group-hover:text-primary">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@psicopedagogia.poramor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-sm hover:bg-white hover:text-red-600 transition-all transform hover:-translate-y-1 cursor-pointer group"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current transition-colors text-white group-hover:text-red-600">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Navegação</h4>
            <ul className="space-y-4">
              {[
                { label: 'Sobre', id: 'sobre' },
                { label: 'Metodologia', id: 'metodologia' },
                { label: 'Serviços', id: 'servicos' },
                { label: 'Biblioteca', id: 'biblioteca' },
                { label: 'Dúvidas', id: 'faq' }
              ].map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => scrollToSection(item.id)}
                    className="text-white/60 hover:text-white transition-colors font-body text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <a href="/area-cliente" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors font-bold text-sm">
                  Portal do Cliente
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Contato</h4>
            <ul className="space-y-6">
              <li>
                <a href="tel:+5516991864393" className="group flex items-center gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all">
                    <Phone size={18} />
                  </div>
                  <span className="text-white/60 font-body text-sm">(16) 99186-4393</span>
                </a>
              </li>
              <li>
                <a href="mailto:psicopedagogia.poramor.2026@gmail.com" className="group flex items-center gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all">
                    <Mail size={18} />
                  </div>
                  <span className="text-white/60 font-body text-sm break-all">psicopedagogia.poramor.2026@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/40 text-[11px] font-body uppercase tracking-widest">
            © {new Date().getFullYear()} Psicopedagogia por Amor — Raiane E. Ferreira
          </p>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-3 text-white/60 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
          >
            Voltar ao topo
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
