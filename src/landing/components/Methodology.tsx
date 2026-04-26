import React from 'react';
import { Search, Sparkles, Map, Laptop, GraduationCap } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Mapeamento e Diagóstico',
    description: 'Investigamos não apenas o que a criança "não sabe", mas como ela processa a informação utilizando instrumentos lúdicos e testes neuropsicopedagógicos.',
    icon: <Search size={28} strokeWidth={1.5} />,
    color: 'bg-primary/5',
    accent: 'text-primary border-primary/20'
  },
  {
    id: '02',
    title: 'Ação com Cogni e Afetina',
    description: 'A intervenção acontece. Nossos companheiros lúdicos (Cogni para a inteligência, Afetina para o acolhimento) ajudam a criança a criar novas conexões neurais sem medo de errar.',
    icon: (
      <div className="flex -space-x-3 group-hover:scale-110 transition-transform duration-500">
        <img src="/cogni.png" alt="Cogni" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-primary/10" />
        <img src="/afetina.png" alt="Afetina" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-accent/10 z-10" />
      </div>
    ),
    color: 'bg-accent/5',
    accent: 'text-accent border-accent/20'
  },
  {
    id: '03',
    title: 'Autonomia para Voar',
    description: 'O verdadeiro sucesso não é depender da terapeuta para sempre, mas sim conquistar o protagonismo da própria aprendizagem com ferramentas práticas.',
    icon: <Map size={28} strokeWidth={1.5} />,
    color: 'bg-primary/5',
    accent: 'text-primary border-primary/20'
  }
];

const Methodology: React.FC = () => {
  return (
    <section id="metodologia" className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- SECTION: O que é Psicopedagogia (Versus Reforço) --- */}
        <div className="bg-white rounded-md p-8 sm:p-16 mb-24 lg:mb-32 flex flex-col lg:flex-row items-center gap-16 shadow-premium border border-muted/10 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-primary/5 opacity-50"></div>

          <div className="flex-1 relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-pill text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              A Diferença Real
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-primary mb-8 leading-tight">
              Psicopedagogia <span className="text-accent">não é</span> Reforço Escolar.
            </h2>
            
            <div className="space-y-6">
              <p className="text-text/70 font-body text-lg leading-relaxed">
                O reforço escolar foca no <strong>o quê</strong>: ensinar um conteúdo de matemática ou português que ficou para trás. 
              </p>
              <p className="text-text/70 font-body text-lg leading-relaxed shadow-sm bg-background p-6 rounded-md border border-muted/10">
                A Psicopedagogia foca no <strong>como</strong>: investigar por que a matemática não entra, trabalhando atenção, memória funcional, bloqueios emocionais e as funções executivas do cérebro.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
               <button 
                  onClick={() => window.open('https://wa.me/5516991864393', '_blank')}
                  className="w-full sm:w-auto bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-4 px-8 rounded-pill transition-all text-sm uppercase tracking-widest text-center"
                >
                  Entender o Caso do Meu Filho
                </button>
            </div>
          </div>
          
          {/* Visual Divider / Icon Column */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6 relative z-10">
             <div className="bg-background p-8 rounded-md border border-muted/10 text-center hover:-translate-y-2 transition-transform duration-500 shadow-sm">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-text/40">
                   <GraduationCap size={28} />
                </div>
                <h4 className="font-display font-bold text-primary mb-2">Reforço Escolar</h4>
                <p className="text-sm font-body text-text/60">Ajuda pontual para a próxima prova. Trata o sintoma acadêmico.</p>
             </div>

             <div className="bg-primary p-8 rounded-md text-center hover:-translate-y-2 transition-transform duration-500 shadow-premium relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent text-white flex items-center justify-center rounded-full animate-bounce-subtle shadow-lg">
                   <Sparkles size={20} />
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                   <Search size={28} />
                </div>
                <h4 className="font-display font-bold text-white mb-2">Psicopedagogia</h4>
                <p className="text-sm font-body text-white/80">Reconstrução da rota de aprendizagem. Trata a raiz neurológica e emocional.</p>
             </div>
          </div>
        </div>

        {/* --- SECTION: Passos da Metodologia --- */}
        <div className="text-center mb-16 lg:mb-24">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[12px] mb-4 block">A Jornada Clínica</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary">
            Como construímos a <span className="text-accent">autonomia.</span>
          </h2>
        </div>

        <div className="space-y-8 mb-24">
          
          {/* FASE 1: Diagnóstico */}
          <div className="bg-white rounded-md p-8 md:p-12 lg:p-16 shadow-premium border border-muted/10 flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -z-0 opacity-50 transition-opacity group-hover:opacity-100"></div>
            
            <div className="md:w-1/3 shrink-0 relative z-10">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-md flex items-center justify-center border border-primary/20 rotate-3 group-hover:-rotate-3 transition-transform duration-700 mx-auto md:mx-0">
                <Search size={48} className="text-primary" strokeWidth={1} />
              </div>
            </div>
            
            <div className="md:w-2/3 relative z-10 text-center md:text-left">
              <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block">Fase Inicial</span>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-6 leading-tight">
                Mapeamento Profundo
              </h3>
              <p className="text-text/70 font-body text-lg leading-relaxed mb-6">
                Antes de qualquer ação, nós mapeamos. Usamos instrumentos lúdicos e testes neuropsicopedagógicos validados para descobrir exatamente <strong>como</strong> a criança processa a informação.
              </p>
            </div>
          </div>

          {/* FASE 2: Intervenção Lúdica com Cogni e Afetina (DESTAQUE) */}
          <div className="bg-background rounded-md overflow-hidden shadow-ambient relative border border-muted/5">
             
             {/* Text Header for Phase 2 */}
             <div className="px-8 md:px-16 pt-16 pb-8 text-center relative z-10">
                <span className="text-accent font-bold tracking-widest uppercase text-[10px] mb-3 block border border-accent/20 bg-accent/10 px-4 py-2 rounded-pill inline-block">Fase de Intervenção</span>
                <h3 className="text-3xl sm:text-5xl font-display font-bold text-primary mb-6">
                   A magia da Neuroplasticidade
                </h3>
                <p className="text-text/70 font-body text-lg leading-relaxed max-w-3xl mx-auto">
                   A intervenção não é uma aula chata. É aqui que nossos grandes parceiros entram em cena. Quando o afeto se une à técnica estruturada, o cérebro cria novas conexões.
                </p>
             </div>

             {/* The Characters Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/50 backdrop-blur-sm relative z-10 border-t border-muted/10">
                
                {/* COGNI */}
                <div className="bg-white p-10 lg:p-16 flex flex-col items-center text-center relative group overflow-hidden">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   
                   <div className="w-48 h-48 lg:w-56 lg:h-56 mb-8 relative z-10 transition-transform duration-700 group-hover:-translate-y-4">
                      <img src="/cogni.png" alt="Cogni - O Parceiro da Inteligência" className="w-full h-full object-contain filter drop-shadow-2xl" />
                   </div>
                   
                   <h4 className="text-3xl font-display font-bold text-primary mb-4 relative z-10">Cogni</h4>
                   <p className="text-text/70 font-body leading-relaxed text-base lg:text-lg relative z-10">
                      Representa a <strong>cognição e a neurociência</strong>. Ele traz foco, memória, estratégia e ajuda a criança a organizar as ideias de um jeito divertido.
                   </p>
                </div>

                {/* AFETINA */}
                <div className="bg-white p-10 lg:p-16 flex flex-col items-center text-center relative group overflow-hidden">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   
                   <div className="w-48 h-48 lg:w-56 lg:h-56 mb-8 relative z-10 transition-transform duration-700 group-hover:-translate-y-4">
                      <img src="/afetina.png" alt="Afetina - O Poder do Acolhimento" className="w-full h-full object-contain filter drop-shadow-2xl" />
                   </div>
                   
                   <h4 className="text-3xl font-display font-bold text-accent mb-4 relative z-10">Afetina</h4>
                   <p className="text-text/70 font-body leading-relaxed text-base lg:text-lg relative z-10">
                      O símbolo do <strong>vínculo e das emoções</strong>. Sem ela, o aprendizado esfria. Ela garante que a sessão seja um porto seguro.
                   </p>
                </div>

             </div>
          </div>

          {/* FASE 3: Autonomia */}
          <div className="bg-primary text-white rounded-md p-8 md:p-12 lg:p-16 shadow-premium flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            <div className="md:w-2/3 relative z-10 text-center md:text-left order-2 md:order-1">
              <span className="text-white/60 font-bold tracking-widest uppercase text-[10px] mb-3 block">Fase Final</span>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Autonomia para Voar
              </h3>
              <p className="text-white/80 font-body text-lg leading-relaxed">
                Toda terapia bem sucedida deve ter fim. O objetivo final é criar uma bagagem tão robusta para a criança, que ela passa a ser a comandante do próprio aprendizado.
              </p>
            </div>

            <div className="md:w-1/3 shrink-0 relative z-10 flex justify-center order-1 md:order-2">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-md rounded-md flex items-center justify-center border border-white/20 -rotate-3 group-hover:rotate-3 transition-transform duration-700">
                <Map size={48} className="text-white" strokeWidth={1} />
              </div>
            </div>
          </div>

        </div>

        {/* --- SECTION: App / Área do Cliente --- */}
        <div className="bg-accent text-white rounded-md p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-premium mb-12">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-80 pointer-events-none"></div>
           
           <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Laptop className="text-white" size={28} strokeWidth={1.5} />
                <span className="font-bold uppercase tracking-widest text-xs text-white/60">Tecnologia e Transparência</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-display font-bold mb-6 leading-tight">
                 O tratamento continua <br/> <span className="text-primary opacity-80">na palma da mão.</span>
              </h3>
              <p className="font-body text-white/70 leading-relaxed text-lg mb-8">
                 Transparência total é o nosso lema. Através da nossa Área do Cliente exclusiva, os pais acompanham de perto a evolução técnica.
              </p>
           </div>

           <div className="w-full md:w-auto relative z-10 shrink-0">
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-md border border-white/10 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                     <Laptop size={32} className="text-accent" />
                  </div>
                  <h4 className="font-display font-bold text-white mb-2">Portal do Cliente</h4>
                  <p className="text-xs font-body text-white/60 mb-6 max-w-[200px] mx-auto">Acesse seu ambiente seguro</p>
                  <button 
                     onClick={() => {
                        const element = document.getElementById('cliente');
                        if (element) {
                           const y = element.getBoundingClientRect().top + window.scrollY - 100;
                           window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                     }}
                     className="w-full bg-white text-accent font-bold py-3 px-6 rounded-pill text-xs uppercase tracking-widest hover:bg-background transition-colors"
                  >
                     Acessar Informações
                  </button>
               </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Methodology;
