import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, PlayCircle, Phone, Mail, ArrowUp, Heart } from 'lucide-react';

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
    <footer className="bg-white border-t border-outline-variant/10 pt-24 pb-12 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group w-fit mx-auto lg:mx-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-12 h-12 bg-primary/5 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110 shrink-0">
                <Heart size={24} className="text-primary fill-primary/20" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-black text-primary text-2xl sm:text-3xl tracking-tight transition-colors">
                  Psicopedagogia
                </span>
                <span className="font-sans font-extrabold text-xs sm:text-sm text-on-surface/80 uppercase tracking-[0.25em] -mt-0.5">
                  por Amor
                </span>
              </div>
            </div>
            
            <p className="text-on-surface/60 font-body text-base leading-relaxed max-w-sm">
              Potencializando o aprendizado através de intervenções científicas e acolhimento especializado. Uma jornada de descobertas e conquistas.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mx-auto lg:mx-0 w-fit">
              <a 
                href="https://www.instagram.com/psicopedagogia.poramor/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Camera size={26} />
              </a>
              <a 
                href="https://www.youtube.com/@psicopedagogia.poramor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 border border-red-600/20 shadow-sm hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <PlayCircle size={26} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-black text-on-surface uppercase tracking-[0.3em]">Navegação</h4>
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
                    className="text-on-surface/60 hover:text-primary transition-colors font-body text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <a href="/area-cliente" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors font-bold text-sm">
                  Portal do Cliente
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-xs font-black text-on-surface uppercase tracking-[0.3em]">Contato</h4>
            <ul className="space-y-6">
              <li>
                <a href="tel:+5516991864393" className="group flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Phone size={18} />
                  </div>
                  <span className="text-on-surface/60 font-body text-sm">(16) 99186-4393</span>
                </a>
              </li>
              <li>
                <a href="mailto:contato@psicopedagogiaporamor.com.br" className="group flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail size={18} />
                  </div>
                  <span className="text-on-surface/60 font-body text-sm break-all">contato@psicopedagogiaporamor.com.br</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-on-surface/40 text-[11px] font-body uppercase tracking-widest">
            © {new Date().getFullYear()} Psicopedagogia por Amor — Raiane E. Ferreira
          </p>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-3 text-on-surface/60 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest"
          >
            Voltar ao topo
            <div className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center group-hover:border-primary transition-all">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
