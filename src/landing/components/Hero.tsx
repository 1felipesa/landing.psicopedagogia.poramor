import React from 'react';
import { Download } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import heroImg from '../../assets/images/hero.png';
import { trackConversion } from '../../utils/analytics';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="pt-32 pb-20 px-4 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-7xl relative">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-pill text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-primary/10">

              Psicopedagogia Clínica & Institucional
            </div>

            <h1 className="text-[length:var(--fluid-h1)] font-display font-bold text-primary leading-[1.1] mb-8">
              Transformando dificuldades em <span className="text-accent">potenciais</span> de aprendizagem.
            </h1>

            <p className="text-[length:var(--fluid-body)] text-text/70 font-body leading-relaxed max-w-2xl mb-12 mx-auto lg:mx-0">
              Apoio especializado presencial e online para crianças de 4 a 14 anos superarem bloqueios escolares com leveza, afeto e ciência.
              <span className="block mt-4 text-primary font-bold text-xs uppercase tracking-widest">🗓️ Agenda aberta para 2026 • Ribeirão Preto e Online</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <a
                href="https://wa.me/5516991864393"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion('Contact', 'HeroPrincipalAgendar')}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold py-5 px-10 rounded-pill shadow-premium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg group cursor-pointer"
              >
                <WhatsAppIcon size={22} className="group-hover:rotate-12 transition-transform" />
                Destravar o Aprendizado do meu Filho
              </a>

            </div>
          </div>

          <div className="flex-1 relative w-full max-w-xl group/image">
            <div className="relative aspect-[4/5] sm:aspect-square">
              {/* Tonal Stacking Layers */}
              <div className="absolute inset-4 bg-accent/10 rounded-2xl -rotate-3 transition-transform group-hover/image:-rotate-1"></div>
              <div className="absolute inset-0 bg-white rounded-2xl shadow-ambient"></div>

              <div className="relative w-full h-full rounded-2xl overflow-hidden border-8 border-white shadow-premium">
                <img
                  src={heroImg}
                  alt="Raiane E. Ferreira - Psicopedagoga"
                  className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-1000"
                  loading="eager"
                />
              </div>

              {/* Float Element for Visual Depth */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-premium animate-float hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold">★</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Atendimento</p>
                    <p className="text-sm font-bold text-primary">Humanizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
