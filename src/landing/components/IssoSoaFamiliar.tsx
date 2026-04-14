import React from 'react';
import { Brain, Frown, Clock, AlertCircle, TrendingDown, BookOpen, MessageCircle } from 'lucide-react';

const situations = [
  {
    title: 'Esquecimento Constante',
    description: 'Parece que ele estuda, entende, mas no dia seguinte "sumiu" da memória? Isso pode ser uma falha no processamento, não falta de esforço.',
    icon: <Brain size={28} strokeWidth={1.5} />,
    color: 'bg-primary/5',
    accent: 'text-primary'
  },
  {
    title: 'Choro na Hora da Lição',
    description: 'A hora do dever de casa virou um campo de batalha emocional? O bloqueio com a aprendizagem gera frustração real na criança.',
    icon: <Frown size={28} strokeWidth={1.5} />,
    color: 'bg-secondary/5',
    accent: 'text-secondary'
  },
  {
    title: 'Desatenção e Foco Disperso',
    description: 'Qualquer mosca que passa tira a concentração? A dificuldade em filtrar estímulos impede que o aprendizado se consolide.',
    icon: <Clock size={28} strokeWidth={1.5} />,
    color: 'bg-tertiary/5',
    accent: 'text-tertiary'
  },
  {
    title: 'Leitura Lenta ou Travada',
    description: 'Ele evita ler em voz alta ou troca letras constantemente? A dislexia ou dificuldades de decodificação precisam de olhar clínico.',
    icon: <BookOpen size={28} strokeWidth={1.5} />,
    color: 'bg-primary/5',
    accent: 'text-primary'
  },
  {
    title: 'Queda na Autoestima',
    description: '"Eu sou burro" ou "eu não consigo". Quando a criança começa a se definir pela dificuldade, o impacto é para a vida toda.',
    icon: <TrendingDown size={28} strokeWidth={1.5} />,
    color: 'bg-secondary/5',
    accent: 'text-secondary'
  },
  {
    title: 'Desorganização com Prazos',
    description: 'Mochila bagunçada, trabalhos esquecidos e correria. Falhas nas funções executivas impedem a autonomia escolar.',
    icon: <AlertCircle size={28} strokeWidth={1.5} />,
    color: 'bg-tertiary/5',
    accent: 'text-tertiary'
  }
];

const IssoSoaFamiliar: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-surface relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-4 block">Identificação</span>
          <h2 className="text-4xl sm:text-6xl font-display font-black text-on-surface mb-8 leading-tight text-editorial">
            Isso soa <span className="text-primary">familiar?</span>
          </h2>
          <p className="text-on-surface/60 font-body text-lg leading-relaxed">
            Muitas vezes, o que parece ser "preguiça" ou "falta de interesse" é, na verdade, uma barreira neurológica ou emocional que a criança não consegue vencer sozinha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {situations.map((item, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-premium hover:shadow-ambient transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${item.color} ${item.accent} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-display font-black text-on-surface mb-4 leading-tight">
                {item.title}
              </h3>
              <p className="text-on-surface/60 font-body text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-2 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/5 shadow-sm">
                <p className="px-6 text-on-surface/60 font-body text-sm">
                    Você não precisa trilhar esse caminho sozinha.
                </p>
                <button 
                  onClick={() => window.open('https://wa.me/5516991864393', '_blank')}
                  className="bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2 text-white font-bold py-4 px-8 rounded-full shadow-premium transition-all text-sm uppercase tracking-widest"
                >
                    <MessageCircle size={18} />
                    Buscar Orientação Especializada
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default IssoSoaFamiliar;
