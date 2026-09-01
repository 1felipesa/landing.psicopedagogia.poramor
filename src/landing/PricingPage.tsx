import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Check, 
  X, 
  Star, 
  Clock, 
  GraduationCap, 
  MessageCircleQuestion, 
  ChevronDown, 
  ChevronUp, 
  ReceiptText,
  ArrowRight
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import SEO from './components/SEO';
import WhatsAppIcon from './components/WhatsAppIcon';
import { trackConversion } from '../utils/analytics';

interface PlanFeature {
  title: string;
  value: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  price: string;
  priceSub: string;
  paymentTerm: string;
  description: string;
  idealFor: string;
  sessionsCount: string;
  features: PlanFeature[];
  highlight: boolean;
  cardBg: string;
  headerText: string;
  descText: string;
  priceText: string;
  btnClass: string;
  iconColor: string;
  whatsappMessage: string;
}

const plansData: Plan[] = [
  {
    id: 'diagnostico',
    name: 'Diagnóstico',
    subtitle: 'Mapeamento & Clareza',
    price: 'R$ 600,00',
    priceSub: 'R$ 300,00 por sessão',
    paymentTerm: 'Pagamento via PIX ou Dinheiro (até 24h antes da sessão)',
    description: 'Investigação aprofundada para identificar a raiz das dificuldades escolares e traçar o perfil de aprendizagem da criança.',
    idealFor: 'Para entender o motivo das dificuldades e obter um parecer técnico inicial.',
    sessionsCount: '2 Sessões Estruturadas',
    features: [
      { title: 'Anamnese Completa com a Família', value: 'Investigação do histórico do desenvolvimento e rotina', included: true },
      { title: 'Sessão de Avaliação Lúdico-Cognitiva', value: 'Testagem e observação das funções executivas e pedagógicas', included: true },
      { title: 'Acesso à Área do Cliente', value: 'Acesso para preenchimento de anamnese e download do recibo final', included: true },
      { title: 'Devolutiva com Parecer Inicial', value: 'Reunião de orientação com direcionamentos práticos para a família', included: true },
      { title: 'Recibo Profissional Consolidado', value: 'Emitido ao final do plano com todas as datas e valores pagos para reembolso', included: true },
      { title: 'Sessões de Intervenção Cognitivo-Afetiva', value: 'Não incluso nesta etapa inicial', included: false },
      { title: 'Reunião de Alinhamento com a Escola', value: 'Não incluso', included: false },
      { title: 'Suporte Contínuo via WhatsApp', value: 'Não incluso', included: false },
    ],
    highlight: false,
    cardBg: 'bg-white border-muted/20 shadow-ambient hover:shadow-premium',
    headerText: 'text-primary',
    descText: 'text-text/70',
    priceText: 'text-primary',
    btnClass: 'bg-accent hover:bg-accent/90 text-white shadow-ambient hover:shadow-premium',
    iconColor: 'text-primary',
    whatsappMessage: 'Olá Dra. Raiane! Gostaria de agendar o Plano Diagnóstico para o meu filho.'
  },
  {
    id: 'autonomia',
    name: 'Autonomia',
    subtitle: 'Intervenção & Resultados',
    badge: 'Mais Escolhido / Recomendado',
    price: 'R$ 1.920,00',
    priceSub: 'R$ 240,00 por sessão (20% OFF)',
    paymentTerm: 'Pagamento via PIX ou Dinheiro antes de cada sessão',
    description: 'O programa completo de intervenção terapêutica que transforma bloqueios em autonomia de estudo e autoconfiança.',
    idealFor: 'Para destravar leitura, escrita, foco, matemática e rotina de estudos.',
    sessionsCount: '8 Sessões Integradas',
    features: [
      { title: 'Acesso Total ao Portal do Paciente', value: 'Histórico, evolução de objetivos, agenda de sessões, exercícios e recibos', included: true, highlight: true },
      { title: '2 Sessões de Diagnóstico Inicial', value: 'Mapeamento cognitivo e afetivo completo da aprendizagem', included: true },
      { title: '4 Sessões de Intervenção Personalizada', value: 'Exercícios práticos com base na neuropsicopedagogia clínica', included: true },
      { title: '1 Sessão de Acompanhamento Familiar', value: 'Orientações práticas para o dia a dia e lição de casa sem estresse', included: true },
      { title: '1 Reunião de Alinhamento Escolar', value: 'Presencial ou online: ponte direta entre terapeuta, professores e coordenação pedagógica', included: true, highlight: true },
      { title: 'Suporte via WhatsApp no Período Comercial', value: 'Segunda a sexta das 9h às 19h com respostas no mesmo dia', included: true },
      { title: 'Recibo Profissional Consolidado', value: 'Emitido ao final do plano com todas as datas e valores pagos para reembolso', included: true },
    ],
    highlight: true,
    cardBg: 'bg-primary text-white border-primary shadow-premium',
    headerText: 'text-white',
    descText: 'text-white/80',
    priceText: 'text-accent',
    btnClass: 'bg-accent hover:bg-accent/90 text-white shadow-ambient hover:shadow-premium',
    iconColor: 'text-accent',
    whatsappMessage: 'Olá Dra. Raiane! Gostaria de agendar o Plano Autonomia (Recomendado) para o meu filho.'
  },
  {
    id: 'neuroafetivo',
    name: 'Neuroafetivo',
    subtitle: 'Acompanhamento Integral',
    badge: 'Cuidado Contínuo',
    price: 'R$ 4.320,00',
    priceSub: 'R$ 240,00 por sessão (20% OFF)',
    paymentTerm: 'Pagamento via PIX ou Dinheiro antes de cada sessão',
    description: 'Acompanhamento intensivo e prolongado para casos complexos (TDAH, Dislexia, TEA) com máxima reserva de agenda e proximidade.',
    idealFor: 'Para laudos de TDAH, Dislexia, TEA e necessidade de acompanhamento contínuo.',
    sessionsCount: '18 Sessões Especializadas',
    features: [
      { title: 'Acesso Total ao Portal do Paciente', value: 'Histórico, evolução de objetivos, agenda de sessões, exercícios e recibos', included: true },
      { title: '4 Sessões de Diagnóstico e Perfil Neurocognitivo', value: 'Investigação profunda das funções executivas e linguagem', included: true },
      { title: '10 Sessões de Intervenção Neuroafetiva', value: 'Treinamento contínuo de habilidades de leitura, escrita, cálculo e foco', included: true },
      { title: '2 Sessões de Acompanhamento Familiar', value: 'Ajuste de rotina, limites, regulação emocional e ambiente de estudos', included: true },
      { title: '2 Reuniões de Alinhamento com a Escola', value: 'Presencial em Ribeirão Preto ou Online para demais localidades', included: true, highlight: true },
      { title: 'Suporte Prioritário no WhatsApp (7 dias/semana)', value: 'Atendimento contínuo com resposta rápida em até 2 horas', included: true, highlight: true },
      { title: 'Adaptação Curricular & Parecer Final', value: 'Parecer pedagógico oficial e auxílio na adaptação de avaliações', included: true },
    ],
    highlight: false,
    cardBg: 'bg-white border-muted/20 shadow-ambient hover:shadow-premium',
    headerText: 'text-primary',
    descText: 'text-text/70',
    priceText: 'text-primary',
    btnClass: 'bg-accent hover:bg-accent/90 text-white shadow-ambient hover:shadow-premium',
    iconColor: 'text-primary',
    whatsappMessage: 'Olá Dra. Raiane! Gostaria de entender mais sobre o Plano Neuroafetivo para o meu filho.'
  }
];

const faqs = [
  {
    q: 'Como funciona o pagamento das sessões e planos?',
    a: 'O pagamento é realizado exclusivamente via PIX ou em Dinheiro. O acerto é feito de forma prévia antes de cada sessão (com até 24 horas de antecedência ao horário agendado), momento em que a família também confirma a sua presença. Existe um acordo tácito entre a família e a profissional para manter a regularidade do plano escolhido.'
  },
  {
    q: 'É emitida Nota Fiscal? Como e quando funciona o Recibo Profissional?',
    a: 'Não há emissão de nota fiscal jurídica. Ao término do plano contratado, emitimos um Recibo Profissional consolidado contendo todas as datas das sessões realizadas e os respectivos pagamentos efetuados. O documento fica disponível na Área do Cliente para download e pode ser utilizado para solicitação de reembolso no seu plano de saúde.'
  },
  {
    q: 'Consigo solicitar reembolso pelo meu plano de saúde?',
    a: 'Sim. Você pode utilizar o Recibo Profissional emitido ao final do plano contratado para dar entrada no pedido de reembolso junto à sua operadora de plano de saúde. Vale ressaltar que a concessão e as porcentagens de reembolso dependem exclusivamente do seu tipo de plano e das diretrizes da operadora, sem garantias de deferimento pela profissional.'
  },
  {
    q: 'Posso deduzir os valores pagos no Imposto de Renda (IR)?',
    a: 'Não. De acordo com as normas vigentes da Receita Federal, os atendimentos psicopedagógicos não integram o rol de despesas de saúde dedutíveis na declaração de Imposto de Renda.'
  },
  {
    q: 'Por que o atendimento é estruturado em planos e não em sessões soltas?',
    a: 'O desenvolvimento cognitivo e emocional de uma criança não acontece em consultas isoladas. Nossos planos garantem início, meio e fim: diagnosticamos com rigor, aplicamos a intervenção terapêutica, alinhamos as orientações com a escola e treinamos os pais em casa. Essa abordagem estruturada é comprovadamente mais eficaz para gerar autonomia real.'
  },
  {
    q: 'O atendimento pode ser feito 100% online?',
    a: 'Sim! Para crianças e adolescentes em qualquer lugar do Brasil e exterior, contamos com recursos digitais interativos e a plataforma exclusiva de atendimento. Para quem reside em Ribeirão Preto/SP e região, o atendimento pode ser realizado de forma presencial no consultório.'
  }
];

const PricingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body selection:bg-primary/20 selection:text-primary">
      <SEO 
        title="Planos de Atendimento e Valores | Dra. Raiane Ferreira"
        description="Conheça nossos planos estruturados de Psicopedagogia Clínica e Neuropsicopedagogia em Ribeirão Preto e Online. Transparência, afeto e intervenção baseada em evidências."
      />
      <Header />

      <main className="flex-grow pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-primary font-bold uppercase text-[11px] tracking-[0.2em] mb-6 hover:text-accent transition-colors group cursor-pointer"
            >
              <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
              Voltar para a Página Inicial
            </Link>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary leading-[1.1] mb-6">
              Investimento no futuro e na <span className="text-accent">autonomia</span> do seu filho.
            </h1>

            <p className="text-text/70 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Planos terapêuticos completos que integram a criança, a família e a escola com início, meio e resultados comprovados.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-primary/80">
              <span className="inline-flex items-center gap-1.5 bg-primary/5 px-3.5 py-2 rounded-pill border border-primary/10">
                <ReceiptText size={16} className="text-primary" /> Recibo Profissional para Reembolso
              </span>
              <span className="inline-flex items-center gap-1.5 bg-primary/5 px-3.5 py-2 rounded-pill border border-primary/10">
                <Clock size={16} className="text-primary" /> Presencial & Online
              </span>
              <span className="inline-flex items-center gap-1.5 bg-primary/5 px-3.5 py-2 rounded-pill border border-primary/10">
                <GraduationCap size={16} className="text-primary" /> Integração com a Escola
              </span>
            </div>
          </div>

          {/* Horizontal Plans Layout (Desktop: Full Row Blocks • Mobile: Clean Responsive Cards) */}
          <div className="flex flex-col gap-8 mb-24">
            {plansData.map((plan) => (
              <div
                key={plan.id}
                id={`plan-${plan.id}`}
                className={`relative rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-500 ${plan.cardBg} ${
                  plan.highlight 
                    ? 'shadow-premium ring-4 ring-accent/25 selection:bg-accent selection:text-white' 
                    : 'hover:shadow-ambient selection:bg-primary/20 selection:text-primary'
                }`}
              >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-8 bg-accent text-white px-4 py-1.5 rounded-pill text-[10px] sm:text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                      <Star size={13} fill="currentColor" />
                      {plan.badge}
                    </div>
                  )}

                  {/* Horizontal Grid Container for Desktop */}
                  <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
                    
                    {/* Left Column: Plan Identity, Pricing & Primary CTA */}
                    <div className="lg:w-[320px] xl:w-[360px] shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-muted/15 pb-8 lg:pb-0 lg:pr-10">
                      <div>
                        <span className={`block font-bold uppercase tracking-widest text-[11px] mb-2 ${
                          plan.highlight ? 'text-accent' : 'text-primary/70'
                        }`}>
                          {plan.subtitle}
                        </span>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className={`text-3xl sm:text-4xl font-display font-bold ${plan.headerText}`}>
                            {plan.name}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-pill text-xs font-bold ${
                            plan.highlight ? 'bg-white/15 text-white' : 'bg-primary/10 text-primary'
                          }`}>
                            {plan.sessionsCount}
                          </span>
                        </div>

                        <p className={`font-body text-sm leading-relaxed mb-6 ${plan.descText}`}>
                          {plan.description}
                        </p>

                        <div className="py-4 border-t border-muted/15 mb-6">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={`text-4xl sm:text-5xl font-display font-bold ${plan.priceText}`}>
                              {plan.price}
                            </span>
                          </div>
                          <p className={`text-xs font-bold mb-1.5 ${plan.highlight ? 'text-white/90' : 'text-primary'}`}>
                            {plan.priceSub}
                          </p>
                          <p className={`text-[11px] leading-tight ${plan.highlight ? 'text-white/70' : 'text-text/60'}`}>
                            💵 {plan.paymentTerm}
                          </p>
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/5516991864393?text=${encodeURIComponent(plan.whatsappMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackConversion('Contact', `PricingPage_${plan.name}`)}
                          className={`w-full py-4 px-6 rounded-pill flex items-center justify-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-ambient ${plan.btnClass}`}
                        >
                          <WhatsAppIcon size={18} />
                          Garantir Vaga no {plan.name}
                        </a>
                        <p className={`text-center text-[10px] mt-2 ${plan.highlight ? 'text-white/60' : 'text-text/40'}`}>
                          Atendimento individualizado e vagas limitadas
                        </p>

                        {/* Social Care Alternative Button */}
                        <div className="mt-4 pt-3 border-t border-muted/15 text-center">
                          <Link
                            to="/atendimento-social"
                            onClick={() => trackConversion('Lead', `PricingPage_ToSocial_${plan.name}`)}
                            className={`inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-pill border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                              plan.highlight
                                ? 'border-white/30 text-white hover:bg-white/10'
                                : 'border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40'
                            }`}
                          >
                            <span>Solicitar Atendimento Social</span>
                            <ArrowRight size={13} />
                          </Link>
                          <p className={`text-[10px] mt-1.5 leading-tight ${plan.highlight ? 'text-white/70' : 'text-text/55'}`}>
                            Disponível para famílias de baixa renda, mediante aprovação prévia.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Scope, Target Profile & 2-Column Features Grid */}
                    <div className="flex-1 flex flex-col justify-between">
                      
                      {/* Target Profile Box */}
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed mb-6 font-body flex items-start gap-3 ${
                        plan.highlight ? 'bg-white/10 text-white/90 border border-white/10' : 'bg-surface text-text/70 border border-muted/15 shadow-sm'
                      }`}>
                        <span className="text-base shrink-0">🎯</span>
                        <div>
                          <strong className="block font-bold mb-0.5 text-xs uppercase tracking-wider">
                            Perfil ideal de indicação:
                          </strong>
                          <span>{plan.idealFor}</span>
                        </div>
                      </div>

                      {/* 2-Column Features Grid on Desktop */}
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${
                          plan.highlight ? 'text-accent' : 'text-primary/70'
                        }`}>
                          O que está incluso neste programa:
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {plan.features.map((feat, fIdx) => (
                            <div 
                              key={fIdx}
                              className={`p-3.5 rounded-2xl transition-all flex items-start gap-3 ${
                                plan.highlight
                                  ? 'bg-white/10 border border-white/10'
                                  : 'bg-surface border border-muted/15 shadow-sm'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {feat.included ? (
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    plan.highlight 
                                      ? 'bg-accent text-white' 
                                      : 'bg-accent/15 text-accent'
                                  }`}>
                                    <Check size={12} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-muted/20 text-muted">
                                    <X size={12} strokeWidth={2.5} />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <span className={`block font-bold text-xs sm:text-sm leading-tight ${
                                  plan.highlight 
                                    ? 'text-white' 
                                    : feat.included ? 'text-primary' : 'text-muted'
                                }`}>
                                  {feat.title}
                                </span>
                                <span className={`block text-[11px] sm:text-xs leading-relaxed mt-1 ${
                                  plan.highlight 
                                    ? 'text-white/70' 
                                    : feat.included ? 'text-text/70' : 'text-muted/60'
                                }`}>
                                  {feat.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
            ))}
          </div>

          {/* Pricing FAQ */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-2 block">
                Tire suas dúvidas
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary">
                Perguntas Frequentes sobre Pagamentos e Planos
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-muted/20 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-primary hover:text-accent transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 pt-0 text-sm text-text/70 leading-relaxed font-body border-t border-muted/10 mt-2">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final Help / WhatsApp Banner */}
          <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-premium selection:bg-accent selection:text-white">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 text-accent">
                <MessageCircleQuestion size={28} />
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Ainda em dúvida sobre qual o melhor caminho?
              </h2>

              <p className="text-white/80 font-body text-base mb-8 leading-relaxed">
                Envie uma mensagem contando resumidamente a idade e a dificuldade do seu filho. A Dra. Raiane orientará você sobre a opção mais adequada antes de qualquer compromisso.
              </p>

              <a
                href="https://wa.me/5516991864393?text=Ol%C3%A1%20Dra.%20Raiane!%20Gostaria%20de%20conversar%20sobre%20a%20melhor%20op%C3%A7%C3%A3o%20de%20plano%20para%20o%20meu%20filho."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion('Contact', 'PricingPage_HelpCTA')}
                className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-pill shadow-premium transition-all duration-300 hover:scale-105 cursor-pointer text-sm sm:text-base uppercase tracking-wider"
              >
                <WhatsAppIcon size={20} />
                Conversar com a Dra. Raiane
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
