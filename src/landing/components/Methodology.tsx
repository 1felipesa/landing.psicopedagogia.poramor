import React, { useState } from 'react';

const steps = [
  {
    id: '01',
    title: 'Diagnóstico',
    phase: 'Descoberta do terreno',
    description: 'Investigação detalhada das habilidades e desafios para traçar a melhor rota.',
    icon: '🔍',
    color: 'bg-finn-blue/10 text-finn-blue'
  },
  {
    id: '02',
    title: 'Mediação',
    phase: 'A ponte do aprendizado',
    description: 'Intervenção guiada onde a Psicopedagogia atua como facilitadora da construção do saber.',
    icon: '🤝',
    color: 'bg-jake-yellow/20 text-yellow-700'
  },
  {
    id: '03',
    title: 'Autonomia',
    phase: 'O tesouro da independência',
    description: 'O momento da alta, onde a criança conquista suas ferramentas para seguir aprendendo sozinha.',
    icon: '🏆',
    color: 'bg-lsp-purple/10 text-lsp-purple'
  }
];

const categories = [
  {
    title: 'No Território da Leitura e Escrita',
    icon: '📚',
    color: 'bg-blue-50 border-finn-blue/20',
    accent: 'bg-finn-blue',
    items: [
      'Dificuldade em juntar as letras ou entender o que lê.',
      'Troca de letras na escrita ou fala (mesmo após os 7 anos).',
      'Recusa em ler em voz alta ou escrever textos curtos.'
    ]
  },
  {
    title: 'Nas Montanhas do Foco e Organização',
    icon: '🏔️',
    color: 'bg-yellow-50 border-jake-yellow/30',
    accent: 'bg-jake-yellow',
    items: [
      'Parece estar sempre "nas nuvens" durante as tarefas.',
      'Não consegue organizar a mochila ou os materiais.',
      'Esquece datas de provas ou o que o professor explicou no dia.'
    ]
  },
  {
    title: 'No Vale das Emoções',
    icon: '🌈',
    color: 'bg-purple-50 border-lsp-purple/20',
    accent: 'bg-lsp-purple',
    items: [
      'Desmotivação e frases como "eu não sou inteligente".',
      'Choro ou ansiedade excessiva na hora da lição de casa.',
      'Baixa tolerância à frustração ao aprender algo novo.'
    ]
  },
  {
    title: 'Na Floresta do Raciocínio',
    icon: '🌲',
    color: 'bg-green-50 border-grass-green/20',
    accent: 'bg-grass-green',
    items: [
      'Dificuldade extrema com números ou noção de tempo.',
      'Lentidão excessiva para concluir atividades escolares.'
    ]
  }
];

const Methodology: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearAll = () => {
    setCheckedItems({});
  };

  const hasAnyChecked = Object.values(checkedItems).some(val => val);

  return (
    <section id="metodologia" className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#9C27B0 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* --- CHECKLIST SECTION --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Sinais de que a Jornada precisa de uma Guia
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight max-w-3xl mx-auto">
            O seu pequeno herói travou em algum desses <span className="text-lsp-purple underline decoration-lsp-purple/20 decoration-8 underline-offset-4">desafios?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className={`${cat.color} border-2 rounded-[2.5rem] p-6 sm:p-8 shadow-sm transition-all hover:shadow-md`}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl sm:text-4xl" role="img" aria-label="icon">{cat.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">{cat.title}</h3>
              </div>

              <div className="space-y-4">
                {cat.items.map((item, itemIdx) => {
                  const isChecked = !!checkedItems[`${catIdx}-${itemIdx}`];
                  return (
                    <div
                      key={itemIdx}
                      onClick={() => toggleItem(catIdx, itemIdx)}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <div className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all ${isChecked ? `${cat.accent} border-transparent shadow-lg scale-110` : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                        {isChecked && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                      </div>
                      <span className={`text-sm sm:text-base font-medium transition-colors ${isChecked ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mb-24">
          {hasAnyChecked && (
            <button
              onClick={clearAll}
              className="mb-8 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              Limpar Seleções
            </button>
          )}

          <div className={`max-w-3xl w-full text-center p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border-4 border-dashed border-lsp-purple/20 transition-all duration-500 ${hasAnyChecked ? 'bg-lsp-purple/5 scale-105' : 'bg-transparent'}`}>
            <p className="text-lg sm:text-2xl text-slate-700 font-medium leading-relaxed italic">
              "Se você marcou 'sim' em um ou mais desses itens, não significa que há algo errado com o seu filho, apenas que o mapa dele precisa ser recalibrado por uma especialista. Vamos juntos?"
            </p>
          </div>
        </div>

        {/* --- METHODOLOGY STEPS SECTION --- */}
        <div className="pt-12 border-t border-slate-100">
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-grass-green/10 text-grass-green rounded-full text-xs font-black uppercase tracking-widest mb-4">
              Passo a Passo
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900">
              O <span className="text-grass-green underline decoration-grass-green/20 decoration-8 underline-offset-4">Caminho</span> da Metodologia
            </h3>
            <p className="text-slate-500 mt-4 font-medium italic">Como transformamos esses desafios em autonomia</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-8 overflow-visible">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 flex flex-col items-center text-center group relative w-full translate-y-0 hover:-translate-y-2 transition-transform duration-300">
                <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] ${step.color} flex items-center justify-center text-4xl sm:text-5xl mb-6 sm:mb-8 shadow-xl border-4 border-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                  <span className="absolute -top-3 -right-3 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white text-sm sm:text-base font-black flex items-center justify-center rounded-xl sm:rounded-2xl border-4 border-white shadow-lg transform rotate-12">
                    {step.id}
                  </span>
                  <span role="img" aria-label={step.title}>{step.icon}</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">{step.title}</h4>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-4 block px-2">
                  {step.phase}
                </span>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-[280px] px-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Methodology;
