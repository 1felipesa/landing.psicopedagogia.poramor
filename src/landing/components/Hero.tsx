import React from 'react';
import { Download, MessageCircle, ChevronRight, Heart } from 'lucide-react';
import heroImg from '../../assets/images/hero.png';
import { trackConversion } from '../../utils/analytics';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="pt-32 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-7xl relative">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/10">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Psicopedagogia Clínica & Institucional
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-black text-on-surface leading-[1.05] mb-8 text-editorial">
              Guiando a jornada de quem <span className="text-primary">aprende</span> com afeto e ciência.
            </h1>

            <p className="text-lg sm:text-xl text-on-surface/70 font-body leading-relaxed max-w-2xl mb-12 mx-auto lg:mx-0">
              Transformando dificuldades de aprendizagem em caminhos de descoberta. 
              Atendimento especializado para crianças e adolescentes com olhar humanizado em Ribeirão Preto e Online.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <a
                href="https://wa.me/5516991864393"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion('Contact', 'HeroPrincipalAgendar')}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-10 rounded-full shadow-premium transition-all flex items-center justify-center gap-3 text-lg group"
              >
                <MessageCircle size={22} strokeWidth={2.5} />
                Agendar Consulta
              </a>
              
              <button
                onClick={() => {
                  const element = document.getElementById('biblioteca');
                  if ((window as any).lenis) (window as any).lenis.scrollTo(element);
                  else element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-full shadow-premium transition-all flex items-center justify-center gap-3 text-lg group"
              >
                <Download size={20} />
                Materiais Gratuitos
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-xl group/image">
            <div className="relative aspect-[4/5] sm:aspect-square">
              {/* Tonal Stacking Layers */}
              <div className="absolute inset-4 bg-primary/10 rounded-[3rem] -rotate-3 transition-transform group-hover/image:-rotate-1"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-ambient"></div>
              
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-8 border-white shadow-premium">
                <img
                  src={heroImg}
                  alt="Raiane E. Ferreira - Psicopedagoga"
                  className="w-full h-full object-cover grayscale-[15%] group-hover/image:grayscale-0 transition-all duration-700 scale-105 group-hover/image:scale-100"
                  loading="eager"
                />
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
