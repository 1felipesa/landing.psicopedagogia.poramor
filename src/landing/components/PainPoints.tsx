import React, { useState } from 'react';
import { Brain, Frown, Clock, BookOpen, TrendingDown, ShieldCheck, Sparkles, AlertTriangle, ChevronDown } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { trackConversion } from '../../utils/analytics';

const situations = [
  {
    pain: 'Falta de foco na escola',
    manifestation: 'A criança se distrai facilmente, esquece tarefas e explicações simples e tem extrema dificuldade para iniciar ou terminar os deveres cotidianos.',
    solution: 'Avaliação atencional personalizada e treinos cognitivos focados no fortalecimento das funções executivas e regulação do foco cerebral.',
    icon: Brain,
    color: 'bg-primary/5 text-primary border-primary/10',
    whatsappText: 'Olá Raiane! Vi no site sobre a dificuldade de "Falta de foco na escola" do meu filho e gostaria de agendar uma conversa inicial.'
  },
  {
    pain: 'Choro na hora do dever',
    manifestation: 'Crises de choro, recusa e desespero emocional ao abrir o caderno, transformando o momento de estudo em uma batalha diária estressante.',
    solution: 'Acolhimento afetivo estruturado, desmistificação do erro, técnicas lúdicas de aprendizagem e estratégias que eliminam a ansiedade dos pais e da criança.',
    icon: Frown,
    color: 'bg-accent/5 text-accent border-accent/10',
    whatsappText: 'Olá Raiane! Vi no site sobre a dificuldade de "Choro na hora do dever" do meu filho e gostaria de agendar uma consulta.'
  },
  {
    pain: 'Dificuldade na leitura',
    manifestation: 'Leitura lenta, silabada ou truncada, recusa de ler em voz alta, troca/inversão de letras e falta de compreensão de pequenos enunciados.',
    solution: 'Intervenção fônica multissensorial com suporte dinâmico da Cogni e da Afetina, destravando a decodificação de sílabas de forma divertida e leve.',
    icon: BookOpen,
    color: 'bg-primary/5 text-primary border-primary/10',
    whatsappText: 'Olá Raiane! Meu filho apresenta "Dificuldade na leitura". Vi as abordagens no site e gostaria de agendar uma avaliação.'
  },
  {
    pain: 'Notas baixas constantes',
    manifestation: 'A criança se esforça e estuda horas, mas o resultado final na prova não aparece, gerando desmotivação crônica e sensação de incapacidade.',
    solution: 'Diagnóstico neuropsicopedagógico para encontrar a raiz do bloqueio (atenção, memória ou interpretação) e preenchimento de lacunas de conteúdo de anos anteriores.',
    icon: TrendingDown,
    color: 'bg-accent/5 text-accent border-accent/10',
    whatsappText: 'Olá Raiane! Meu filho está com "Notas baixas constantes". Vi as soluções no site e gostaria de conversar a respeito.'
  },
  {
    pain: 'Falta de autonomia',
    manifestation: 'Dependência total dos pais para fazer qualquer tarefa, não consegue organizar horários, mochila ou materiais sozinho.',
    solution: 'Ensino estruturado de hábitos de estudo, rotinas visuais organizadoras e maturação do planejamento cerebral e organização independente.',
    icon: Clock,
    color: 'bg-primary/5 text-primary border-primary/10',
    whatsappText: 'Olá Raiane! Gostaria de conversar sobre a "Falta de autonomia" do meu filho nas rotinas escolares diárias.'
  },
  {
    pain: 'Desmotivação escolar',
    manifestation: 'Desinteresse generalizado por matérias, apatia perante desafios acadêmicos, preguiça aparente e reclamações constantes para evitar ir à escola.',
    solution: 'Resgate da curiosidade e do prazer intrínseco de descobrir, associando conquistas cognitivas ao vínculo terapêutico afetuoso e seguro.',
    icon: ShieldCheck,
    color: 'bg-accent/5 text-accent border-accent/10',
    whatsappText: 'Olá Raiane! Meu filho está muito desmotivado com a escola. Gostaria de agendar uma conversa inicial.'
  }
];

const PainPoints: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 bg-surface relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-4 block">Identificação</span>
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-primary mb-8 leading-tight">
            Isso soa <span className="text-accent">familiar?</span>
          </h2>
          <p className="text-text/60 font-body text-lg leading-relaxed mb-6">
            Muitas vezes, a "falta de interesse" mascara uma barreira que a criança não consegue vencer sozinha. Clique nos tópicos abaixo para conferir o diagnóstico e a solução.
          </p>
        </div>

        {/* Dropdown Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {situations.map((item, index) => {
            const Icon = item.icon;
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md ${
                  isOpen ? 'border-primary/20 ring-4 ring-primary/5 shadow-premium' : 'border-muted/10'
                }`}
              >
                {/* Header Toggle Button */}
                <button
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer outline-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-primary text-white' : 'bg-primary/5 text-primary group-hover:bg-primary/10'
                    }`}>
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-primary uppercase tracking-wide">
                        {item.pain}
                      </h3>
                      <span className="text-[10px] font-bold text-text/30 group-hover:text-primary transition-colors uppercase tracking-widest block mt-1">
                        {isOpen ? 'Ocultar Detalhes' : 'Clique para abrir'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`shrink-0 text-text/20 transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-text/40'}`}>
                    <ChevronDown size={20} strokeWidth={2.5} />
                  </div>
                </button>

                {/* Expanded Dropdown Content */}
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-0 border-t border-muted/5 flex flex-col gap-4">
                    
                    {/* Manifestation */}
                    <div className="bg-red-50/60 border border-red-100 p-4 rounded-xl flex gap-3 items-start mt-4 shadow-sm">
                      <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="text-[8px] font-bold text-red-500/80 uppercase tracking-widest block mb-1">No cotidiano escolar:</span>
                        <p className="text-text/70 font-body text-xs italic leading-relaxed">
                          "{item.manifestation}"
                        </p>
                      </div>
                    </div>

                    {/* Solution */}
                    <div className="bg-accent/5 border border-accent/15 p-4 rounded-xl flex gap-3 items-start shadow-sm">
                      <Sparkles className="text-accent shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="text-[8px] font-bold text-accent uppercase tracking-widest block mb-1">Caminho da Solução:</span>
                        <p className="text-text/80 font-body text-xs leading-relaxed">
                          {item.solution}
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={`https://wa.me/5516991864393?text=${encodeURIComponent(item.whatsappText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackConversion('Contact', `PainPointsAccordion_${index}`)}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl shadow-premium hover:shadow-ambient flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer mt-2"
                    >
                      <WhatsAppIcon size={16} />
                      Quero ajuda para esta dificuldade
                    </a>

                  </div>
                </div>

              </div>
            );
          })}
        </div>



      </div>
    </section>
  );
};

export default PainPoints;
