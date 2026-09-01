import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Star } from 'lucide-react';
import { trackConversion } from '../../utils/analytics';

const previewPlans = [
  {
    name: 'Diagnóstico',
    focus: 'Mapeamento Inicial',
    sessions: '2 Sessões',
    desc: 'Investigação aprofundada para entender as causas dos bloqueios escolares.',
    tag: 'Entrada',
    highlight: false
  },
  {
    name: 'Autonomia',
    focus: 'Intervenção Terapêutica',
    sessions: '8 Sessões Integradas',
    desc: 'Programa focado em destravar leitura, foco, rotina de estudos e ponte com a escola.',
    tag: 'Mais Recomendado',
    highlight: true
  },
  {
    name: 'Neuroafetivo',
    focus: 'Acompanhamento Integral',
    sessions: '18 Sessões Especializadas',
    desc: 'Cuidado contínuo para TDAH, Dislexia, TEA com suporte prioritário e visitas escolares.',
    tag: 'Cuidado Contínuo',
    highlight: false
  }
];

const PricingTeaser: React.FC = () => {
  return (
    <section id="planos" className="py-24 px-4 bg-surface relative overflow-hidden">
      {/* Subtle Ambient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-4 inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-pill border border-primary/10">
            <Sparkles size={14} className="text-accent" />
            Planos de Atendimento Estruturados
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mb-6 leading-tight">
            Programas desenhados para a <span className="text-accent">transformação</span> real.
          </h2>
          <p className="text-text/70 font-body text-base sm:text-lg leading-relaxed">
            Não trabalhamos com consultas soltas e sem direcionamento. Nossos planos possuem início, meio e fim, integrando a criança, a família e a escola.
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {previewPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between relative ${
                plan.highlight
                  ? 'bg-primary text-white border-primary shadow-premium md:-translate-y-2 selection:bg-accent selection:text-white'
                  : 'bg-white text-text border-muted/20 hover:border-primary/30 hover:shadow-ambient selection:bg-primary/20 selection:text-primary'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white px-3.5 py-1 rounded-pill text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <Star size={12} fill="currentColor" />
                  {plan.tag}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    plan.highlight ? 'text-accent' : 'text-primary/70'
                  }`}>
                    {plan.focus}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-pill ${
                    plan.highlight ? 'bg-white/10 text-white' : 'bg-primary/5 text-primary'
                  }`}>
                    {plan.sessions}
                  </span>
                </div>

                <h3 className={`text-2xl font-display font-bold mb-3 ${
                  plan.highlight ? 'text-white' : 'text-primary'
                }`}>
                  {plan.name}
                </h3>

                <p className={`text-sm leading-relaxed mb-6 font-body ${
                  plan.highlight ? 'text-white/80' : 'text-text/60'
                }`}>
                  {plan.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-muted/10">
                <ul className="space-y-2.5 mb-6 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className={plan.highlight ? 'text-accent' : 'text-primary'} />
                    <span className={plan.highlight ? 'text-white/90' : 'text-text/70'}>Área do cliente exclusiva</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className={plan.highlight ? 'text-accent' : 'text-primary'} />
                    <span className={plan.highlight ? 'text-white/90' : 'text-text/70'}>Recibo profissional para reembolso</span>
                  </li>
                </ul>

                <Link
                  to="/planos"
                  onClick={() => trackConversion('Lead', `HomeTeaser_${plan.name}`)}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    plan.highlight
                      ? 'bg-accent text-white hover:bg-accent/90 shadow-md'
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  Conhecer Plano
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA Link */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-muted/20 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-ambient">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 hidden sm:flex">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-primary text-lg">
                Deseja ver todos os detalhes, valores e formas de pagamento?
              </h4>
              <p className="text-xs sm:text-sm text-text/60 font-body mt-0.5">
                Consulte nossa página detalhada com comparativos e guia de decisão para pais.
              </p>
            </div>
          </div>

          <Link
            to="/planos"
            onClick={() => trackConversion('Lead', 'HomeTeaser_VerTodosPlanos')}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-pill text-xs uppercase tracking-wider whitespace-nowrap flex items-center gap-2 shadow-premium transition-transform hover:scale-105 shrink-0 cursor-pointer"
          >
            Ver Planos de Atendimento
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;
