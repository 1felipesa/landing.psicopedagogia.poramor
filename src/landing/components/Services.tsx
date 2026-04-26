import React from 'react';
import { ClipboardCheck, Zap, Globe, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Avaliação Psicopedagógica',
    subtitle: 'O Primeiro Passo',
    description: 'Processo investigativo profundo para entender o funcionamento cognitivo e emocional do aprendiz. É aqui que descobrimos o mapa neural do seu filho.',
    icon: <ClipboardCheck size={36} strokeWidth={1} />,
    color: 'bg-primary/5 text-primary',
    btn: 'text-primary border-primary/20 hover:bg-primary hover:text-white'
  },
  {
    title: 'Intervenção Clínica',
    subtitle: 'Neuroplasticidade Ativa',
    description: 'Sessões dinâmicas onde, através de jogos e do vínculo, criamos novas conexões cerebrais para sanar as dificuldades de leitura, escrita e matemática.',
    icon: <Zap size={36} strokeWidth={1} />,
    color: 'bg-accent/5 text-accent',
    btn: 'text-accent border-accent/20 hover:bg-accent hover:text-white'
  },
  {
    title: 'Atendimento Híbrido',
    subtitle: 'Presencial & Online',
    description: 'Acolhimento presencial na clínica em Ribeirão Preto, e atendimento online seguro para brasileiros em qualquer lugar do mundo.',
    icon: <Globe size={36} strokeWidth={1} />,
    color: 'bg-primary/5 text-primary',
    btn: 'text-primary border-primary/20 hover:bg-primary hover:text-white'
  }
];

const Services: React.FC = () => {
  return (
    <section id="servicos" className="py-32 px-4 bg-white relative overflow-hidden">
      
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-muted/10 to-transparent -z-10"></div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-24 relative">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-4 block">Nossa Expertise</span>
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-primary mb-6">
            Como destravamos a <span className="text-accent">aprendizagem?</span>
          </h2>
          <p className="text-text/60 font-body text-lg max-w-2xl mx-auto">
            Abordagens baseadas em evidências para acolher a dor de quem tem medo da escola e transformar isso em potência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative z-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="group flex flex-col"
            >
              <div className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto md:mx-0 ${service.color} rounded-md flex items-center justify-center mb-8 shadow-sm group-hover:shadow-premium transition-all duration-500 group-hover:-translate-y-2 border border-muted/5`}>
                <div className="group-hover:scale-110 transition-transform duration-500">
                   {service.icon}
                </div>
              </div>

              <div>
                <span className={`font-bold uppercase tracking-widest text-[9px] mb-4 block ${service.color.split(' ')[1]}`}>
                   {service.subtitle}
                </span>
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-primary mb-4 leading-tight">
                   {service.title}
                </h3>
                <p className="text-text/60 font-body text-base leading-relaxed mb-8">
                  {service.description}
                </p>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => window.open('https://wa.me/5516991864393', '_blank')}
                  className={`inline-flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-pill border transition-all duration-300 w-full hover:shadow-ambient ${service.btn}`}
                >
                  Saiba como funciona <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
