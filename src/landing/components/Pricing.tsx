import React, { useEffect, useRef } from 'react';
import { Check, X, Star } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { trackConversion } from '../../utils/analytics';

const packages = [
  {
    name: 'Diagnóstico',
    subtitle: 'Básico',
    price: 'R$ 600,00',
    priceSub: 'R$ 300,00/sessão',
    description: 'Apenas mapear o(s) problema(s) para diagnóstico da situação.',
    features: [
      { title: 'Acesso a Área do Cliente', value: 'Acesso parcial: apenas para diagnóstico', included: true },
      { title: 'Anamnese Online (área do cliente)', value: 'Sim', included: true },
      { title: 'Sessões de Diagnóstico (60 min)', value: '2 sessões', included: true },
      { title: 'Sessões de Intervenção Cogni/Afetivas', value: 'Não incluso', included: false },
      { title: 'Sessões de Acompanhamento Familiar', value: 'Não incluso', included: false },
      { title: 'Reuniões de Alinhamento Escolar', value: 'Não incluso', included: false },
      { title: 'Suporte pelo Whatsapp', value: 'Não incluso', included: false },
    ],
    highlight: false,
    cardBg: 'bg-white border-muted/10',
    headerText: 'text-primary',
    descText: 'text-text/60',
    priceText: 'text-primary',
    btnClass: 'bg-primary/10 text-primary hover:bg-primary hover:text-white',
    iconColor: 'text-primary',
    whatsappText: 'Olá Raiane! Gostaria de saber mais sobre o Pacote Diagnóstico.'
  },
  {
    name: 'Autonomia',
    subtitle: 'Recomendado',
    price: 'R$ 1.920,00',
    priceSub: 'R$ 240,00/sessão (20% Off)',
    description: 'Mapear e Solucionar o(s) problema(s)',
    features: [
      { title: 'Acesso a Área do Cliente', value: 'Acesso total: histórico de sessões, evolução dos objetivos, download de exercícios e documentos, agenda de sessões, financeiro.', included: true },
      { title: 'Anamnese Online (área do cliente)', value: 'Sim', included: true },
      { title: 'Sessões de Diagnóstico (60 min)', value: '2 sessões', included: true },
      { title: 'Sessões de Intervenção Cogni/Afetivas', value: '4 sessões', included: true },
      { title: 'Sessões de Acompanhamento Familiar', value: '1 sessão', included: true },
      { title: 'Reuniões de Alinhamento Escolar', value: '1 sessão (online)', included: true },
      { title: 'Suporte pelo Whatsapp', value: 'Atendimento seg. a sex. de 9h às 19h. Resposta no mesmo dia.', included: true },
    ],
    highlight: true,
    cardBg: 'bg-primary border-primary/20 shadow-premium',
    headerText: 'text-white',
    descText: 'text-white/80',
    priceText: 'text-accent',
    btnClass: 'bg-accent text-white hover:bg-accent/90 shadow-lg hover:-translate-y-1',
    iconColor: 'text-accent',
    whatsappText: 'Olá Raiane! Gostaria de agendar o Pacote Autonomia (Recomendado).'
  },
  {
    name: 'Neuroafetivo',
    subtitle: 'Premium',
    price: 'R$ 4.320,00',
    priceSub: 'R$ 240,00/sessão (20% Off)',
    description: 'Mapear e Solucionar o(s) problema(s), acompanhamento integral e maior reserva da agenda.',
    features: [
      { title: 'Acesso a Área do Cliente', value: 'Mesmo acesso do Pacote Autonomia', included: true },
      { title: 'Anamnese Online (área do cliente)', value: 'Sim', included: true },
      { title: 'Sessões de Diagnóstico (60 min)', value: '4 sessões', included: true },
      { title: 'Sessões de Intervenção Cogni/Afetivas', value: '10 sessões', included: true },
      { title: 'Sessões de Acompanhamento Familiar', value: '2 sessões', included: true },
      { title: 'Reuniões de Alinhamento Escolar', value: '2 sessões (presencial em Ribeirão Preto, ou online em demais localidades)', included: true },
      { title: 'Suporte pelo Whatsapp', value: 'Atendimento de dom. a dom. em qualquer horário. Resposta em até 2 horas.', included: true },
    ],
    highlight: false,
    cardBg: 'bg-white border-muted/10',
    headerText: 'text-primary',
    descText: 'text-text/60',
    priceText: 'text-primary',
    btnClass: 'bg-primary/10 text-primary hover:bg-primary hover:text-white',
    iconColor: 'text-primary',
    whatsappText: 'Olá Raiane! Gostaria de agendar o Pacote Neuroafetivo (Premium).'
  }
];

const Pricing: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollInterval: ReturnType<typeof setInterval>;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        // Stop autoscroll if on desktop layout (xl breakpoint is 1280px)
        if (window.innerWidth >= 1280) return;

        if (container) {
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          
          // Use the first child's width to know how much to scroll
          const cardElement = container.children[0] as HTMLElement;
          // adding the gap to the scroll amount (gap-4 is 16px)
          const scrollAmount = cardElement ? cardElement.clientWidth + 16 : container.clientWidth;

          if (container.scrollLeft >= maxScrollLeft - 10) {
            // Reset to beginning smoothly
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll to next card smoothly
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 3000);
    };

    startAutoScroll();

    // Pause on user interaction
    const pauseScroll = () => clearInterval(scrollInterval);
    const resumeScroll = () => {
      clearInterval(scrollInterval);
      startAutoScroll();
    };

    container.addEventListener('touchstart', pauseScroll, { passive: true });
    container.addEventListener('touchend', resumeScroll, { passive: true });
    container.addEventListener('mousedown', pauseScroll);
    container.addEventListener('mouseup', resumeScroll);
    container.addEventListener('mouseleave', resumeScroll);
    
    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('touchstart', pauseScroll);
      container.removeEventListener('touchend', resumeScroll);
      container.removeEventListener('mousedown', pauseScroll);
      container.removeEventListener('mouseup', resumeScroll);
      container.removeEventListener('mouseleave', resumeScroll);
    };
  }, []);

  return (
    <section id="planos" className="py-24 px-4 bg-surface relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 xl:mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-4 block">
            Planos de Atendimento
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary mb-6 leading-tight">
            Programas estruturados para a <span className="text-accent">autonomia.</span>
          </h2>
          <p className="text-text/60 font-body text-base sm:text-lg leading-relaxed">
            Nossos planos foram desenhados para oferecer não apenas sessões, mas uma jornada completa de transformação e acompanhamento da sua família.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pt-6 pb-8 -mx-4 px-[7.5vw] sm:px-12 xl:grid xl:grid-cols-3 xl:gap-8 xl:mx-0 xl:px-0 xl:overflow-visible xl:pb-0 xl:pt-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Webkit specific scrollbar hiding handled via inline style + global css usually, but adding standard ones above */}
          <style>{`
            #planos .flex::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {packages.map((pkg, index) => (
            <div 
              key={index} 
              className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-500 flex flex-col w-[85vw] sm:w-[320px] xl:w-auto snap-center shrink-0 xl:shrink xl:h-full ${pkg.cardBg} ${pkg.highlight ? 'xl:-translate-y-4 xl:scale-105 z-10' : 'xl:hover:-translate-y-2'}`}
            >
              {pkg.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1.5 rounded-pill text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                  <Star size={12} fill="currentColor" />
                  Mais Escolhido
                </div>
              )}
              
              <div className="mb-6">
                <span className={`block font-bold uppercase tracking-widest text-[10px] mb-2 ${pkg.highlight ? 'text-accent' : 'text-primary/60'}`}>
                  {pkg.subtitle}
                </span>
                <h3 className={`text-3xl font-display font-bold mb-3 ${pkg.headerText}`}>
                  {pkg.name}
                </h3>
                <p className={`font-body text-sm leading-relaxed min-h-[40px] ${pkg.descText}`}>
                  {pkg.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2 mb-1">
                  <span className={`text-4xl font-display font-bold ${pkg.priceText}`}>{pkg.price}</span>
                </div>
                <span className={`text-xs font-bold ${pkg.highlight ? 'text-white/60' : 'text-text/40'}`}>
                  {pkg.priceSub}
                </span>
              </div>

              <div className="flex-1">
                <ul className="space-y-5 mb-8">
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 ${feature.included ? pkg.iconColor : 'text-text/20'}`}>
                        {feature.included ? <Check size={18} strokeWidth={2.5} /> : <X size={18} strokeWidth={2.5} />}
                      </div>
                      <div className={`text-sm font-body leading-relaxed ${
                        feature.included 
                          ? pkg.highlight ? 'text-white/90' : 'text-text/80' 
                          : pkg.highlight ? 'text-white/50' : 'text-text/40'
                      }`}>
                        <span className={`font-bold block mb-0.5 ${!feature.included && 'line-through opacity-70'}`}>
                            {feature.title}
                        </span>
                        <span className="text-xs opacity-90 block">
                            {feature.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/5516991864393?text=${encodeURIComponent(pkg.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion('Contact', `Pricing_${pkg.name}`)}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer mt-auto ${pkg.btnClass}`}
              >
                <WhatsAppIcon size={18} />
                Escolher Plano
              </a>
            </div>
          ))}
        </div>
        
        {/* Swipe Hint for Mobile */}
        <div className="mt-4 text-center xl:hidden flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Deslize para ver mais</span>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
          </div>
        </div>

        <div className="mt-8 xl:mt-12 text-center">
            <p className="text-xs text-text/40 font-body max-w-2xl mx-auto">
                * Os pacotes e valores podem sofrer ajustes dependendo da complexidade do diagnóstico e demanda da agenda. Pagamento facilitado. Fale conosco para mais detalhes sobre as formas de pagamento.
            </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
