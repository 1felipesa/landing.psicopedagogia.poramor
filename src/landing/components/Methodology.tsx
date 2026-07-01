import React from 'react';
import { Search, Sparkles, Map, GraduationCap } from 'lucide-react';

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
        <div className="bg-white rounded-3xl p-8 sm:p-16 mb-24 lg:mb-32 flex flex-col lg:flex-row items-center gap-16 shadow-premium border border-muted/10 relative overflow-hidden">
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
              <p className="text-text/70 font-body text-lg leading-relaxed shadow-sm bg-background p-6 rounded-xl border border-muted/10">
                A Psicopedagogia foca no <strong>como</strong>: investigar por que a matemática não entra, trabalhando atenção, memória funcional, bloqueios emocionais e as funções executivas do cérebro.
              </p>
            </div>


          </div>

          {/* Visual Divider / Icon Column */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6 relative z-10">
            <div className="bg-background p-8 rounded-2xl border border-muted/10 text-center hover:-translate-y-2 transition-transform duration-500 shadow-sm">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-text/40">
                <GraduationCap size={28} />
              </div>
              <h4 className="font-display font-bold text-primary mb-2">Reforço Escolar</h4>
              <p className="text-sm font-body text-text/60">Ajuda pontual para a próxima prova. Trata o sintoma acadêmico.</p>
            </div>

            <div className="bg-primary p-8 rounded-2xl text-center hover:-translate-y-2 transition-transform duration-500 shadow-premium relative">
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

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          {/* Vertical Timeline Line */}
          <div className="absolute left-10 md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary/10 via-accent/20 to-primary/10"></div>

          <div className="space-y-16 relative z-10">

            {/* STEP 1: Diagnóstico */}
            <div className="flex flex-col md:flex-row items-start md:justify-between group">
              {/* Dot Icon */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-md text-primary group-hover:scale-110 transition-transform duration-300">
                  <Search size={20} strokeWidth={2} />
                </div>
              </div>

              {/* Card Container */}
              <div className="pl-16 md:pl-0 md:w-[45%] transition-all duration-500 group-hover:-translate-y-1">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-muted/10 shadow-sm hover:shadow-premium transition-all duration-300">
                  <span className="text-primary font-bold tracking-widest uppercase text-[9px] mb-2 block">Etapa 1: Diagnóstico</span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-primary mb-4">
                    Mapeamento Profundo
                  </h3>
                  <p className="text-text/70 font-body text-sm sm:text-base leading-relaxed">
                    Antes de agir, nós investigamos. Utilizamos instrumentos lúdicos e testes neuropsicopedagógicos validados cientificamente para descobrir exatamente como seu filho processa e retém a informação.
                  </p>
                </div>
              </div>

              {/* Empty space for layout balance on desktop */}
              <div className="hidden md:block md:w-[45%]"></div>
            </div>

            {/* STEP 2: Intervenção (Cogni & Afetina) */}
            <div className="flex flex-col md:flex-row-reverse items-start md:justify-between group">
              {/* Dot Icon */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-accent flex items-center justify-center shadow-md text-accent group-hover:scale-110 transition-transform duration-300">
                  <Sparkles size={20} strokeWidth={2} />
                </div>
              </div>

              {/* Card Container */}
              <div className="pl-16 md:pl-0 md:w-[45%] transition-all duration-500 group-hover:-translate-y-1">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-muted/10 shadow-sm hover:shadow-premium transition-all duration-300">
                  <span className="text-accent font-bold tracking-widest uppercase text-[9px] mb-2 block">Etapa 2: Intervenção</span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-primary mb-3">
                    Abordagem Neuroafetiva
                  </h3>
                  <p className="text-text/70 font-body text-sm sm:text-base leading-relaxed mb-6">
                    A intervenção une rigor técnico e afeto. Quando a criança se sente segura para errar, criamos novas conexões neurais através do brincar terapêutico orientado.
                  </p>

                  {/* Cogni & Afetina Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cogni */}
                    <div className="bg-primary/5 rounded-xl p-4 flex flex-col items-center text-center">
                      <img src="/cogni.png" alt="Cogni" className="w-20 h-20 object-contain mb-3 filter drop-shadow-md" />
                      <h4 className="font-display font-bold text-sm text-primary mb-1">Cogni</h4>
                      <p className="text-[11px] font-body text-text/70 leading-relaxed">
                        Traz a cognição e a neurociência: foco, memória e organização.
                      </p>
                    </div>

                    {/* Afetina */}
                    <div className="bg-accent/5 rounded-xl p-4 flex flex-col items-center text-center">
                      <img src="/afetina.png" alt="Afetina" className="w-20 h-20 object-contain mb-3 filter drop-shadow-md" />
                      <h4 className="font-display font-bold text-sm text-accent mb-1">Afetina</h4>
                      <p className="text-[11px] font-body text-text/70 leading-relaxed">
                        Traz o vínculo e afeto: acolhimento e segurança emocional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty space for layout balance on desktop */}
              <div className="hidden md:block md:w-[45%]"></div>
            </div>

            {/* STEP 3: Autonomia */}
            <div className="flex flex-col md:flex-row items-start md:justify-between group">
              {/* Dot Icon */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white border-2 border-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Map size={20} strokeWidth={2} />
                </div>
              </div>

              {/* Card Container */}
              <div className="pl-16 md:pl-0 md:w-[45%] transition-all duration-500 group-hover:-translate-y-1">
                <div className="bg-primary text-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-premium transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <span className="text-white/60 font-bold tracking-widest uppercase text-[9px] mb-2 block">Etapa 3: Alta Clínica</span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-4">
                    Autonomia para Voar
                  </h3>
                  <p className="text-white/80 font-body text-sm sm:text-base leading-relaxed">
                    O sucesso é a alta. Fornecemos estratégias práticas para que seu filho organize sua rotina escolar de maneira independente, transformando-o no próprio comandante do seu aprender.
                  </p>
                </div>
              </div>

              {/* Empty space for layout balance on desktop */}
              <div className="hidden md:block md:w-[45%]"></div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Methodology;
