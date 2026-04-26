import React from 'react';
import { Brain, Frown, Clock, BookOpen, TrendingDown, ShieldCheck, MessageCircle } from 'lucide-react';

const situations = [
  {
    pain: 'Falta de foco na escola',
    solution: 'Avaliação atencional e treinos cognitivos personalizados.',
    icon: <Brain size={28} strokeWidth={1.5} />,
    color: 'bg-primary/5',
    accent: 'text-primary'
  },
  {
    pain: 'Choro na hora do dever',
    solution: 'Acolhimento emocional e estratégias de estudo sem estresse.',
    icon: <Frown size={28} strokeWidth={1.5} />,
    color: 'bg-accent/5',
    accent: 'text-accent'
  },
  {
    pain: 'Dificuldade na leitura',
    solution: 'Intervenção psicopedagógica especializada e lúdica.',
    icon: <BookOpen size={28} strokeWidth={1.5} />,
    color: 'bg-primary/5',
    accent: 'text-primary'
  },
  {
    pain: 'Notas baixas constantes',
    solution: 'Identificação da raiz do problema e reforço da base escolar.',
    icon: <TrendingDown size={28} strokeWidth={1.5} />,
    color: 'bg-accent/5',
    accent: 'text-accent'
  },
  {
    pain: 'Falta de autonomia',
    solution: 'Desenvolvimento de funções executivas e organização.',
    icon: <Clock size={28} strokeWidth={1.5} />,
    color: 'bg-primary/5',
    accent: 'text-primary'
  },
  {
    pain: 'Desmotivação escolar',
    solution: 'Resgate do prazer em aprender através do afeto e ciência.',
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    color: 'bg-accent/5',
    accent: 'text-accent'
  }
];

const PainPoints: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-surface relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-4 block">Identificação</span>
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-primary mb-8 leading-tight">
            Isso soa <span className="text-accent">familiar?</span>
          </h2>
          <p className="text-text/60 font-body text-lg leading-relaxed mb-6">
            Muitas vezes, o que parece ser "preguiça" ou "falta de interesse" é, na verdade, uma barreira que a criança não consegue vencer sozinha.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-pill border border-primary/10 animate-pulse">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Dica: Passe o mouse ou toque nos cards</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {situations.map((item, index) => (
            <div 
              key={index}
              className="group h-[240px] [perspective:1000px]"
            >
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] cursor-help">
                {/* Front Side (Pain) */}
                <div className="absolute inset-0 h-full w-full bg-white p-8 rounded-md border border-muted/10 shadow-premium flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
                  <div className={`w-14 h-14 ${item.color} ${item.accent} rounded-pill flex items-center justify-center mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-primary leading-tight mb-4">
                    {item.pain}
                  </h3>
                  <div className="mt-auto text-[9px] text-text/30 font-bold uppercase tracking-[0.15em] opacity-0 group-hover:opacity-0 sm:opacity-100 transition-opacity">
                    Toque para ver a solução
                  </div>
                </div>

                {/* Back Side (Solution) */}
                <div className="absolute inset-0 h-full w-full bg-primary p-8 rounded-md shadow-premium flex flex-col items-center justify-center text-center text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-lg font-body font-medium leading-relaxed">
                    {item.solution}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-2 bg-white/40 backdrop-blur-md rounded-pill border border-muted/5 shadow-sm">
                <p className="px-6 text-text/60 font-body text-sm">
                    Você não precisa trilhar esse caminho sozinha.
                </p>
                <button 
                  onClick={() => window.open('https://wa.me/5516991864393', '_blank')}
                  className="bg-accent hover:bg-accent/90 flex items-center justify-center gap-2 text-white font-bold py-4 px-8 rounded-pill shadow-premium transition-all text-sm uppercase tracking-widest"
                >
                    <MessageCircle size={18} />
                    Buscar Orientação
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
