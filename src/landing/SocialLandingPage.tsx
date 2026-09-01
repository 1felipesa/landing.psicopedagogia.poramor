import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
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
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Users
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import SEO from './components/SEO';
import PainPoints from './components/PainPoints';
import Methodology from './components/Methodology';
import About from './components/About';
import WhatsAppIcon from './components/WhatsAppIcon';
import WhatsAppButton from './components/WhatsAppButton';
import heroImg from '../assets/images/hero.png';
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
  originalPrice: string;
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

const socialPlansData: Plan[] = [
  {
    id: 'diagnostico-social',
    name: 'Diagnóstico Social',
    subtitle: 'Mapeamento & Clareza',
    originalPrice: 'R$ 600,00',
    price: 'R$ 300,00',
    priceSub: 'R$ 150,00 por sessão (50% OFF Social)',
    paymentTerm: 'Pagamento via PIX ou Dinheiro (até 24h antes da sessão)',
    description: 'Investigação aprofundada para identificar a raiz das dificuldades escolares e traçar o perfil de aprendizagem da criança.',
    idealFor: 'Para entender o motivo das dificuldades e obter um parecer técnico inicial com valor acessível.',
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
    whatsappMessage: 'Olá Dra. Raiane! Vim através da página de Atendimento Social e gostaria de solicitar a aprovação para o Plano Diagnóstico Social do meu filho.'
  },
  {
    id: 'autonomia-social',
    name: 'Autonomia Social',
    subtitle: 'Intervenção & Resultados',
    badge: 'Mais Escolhido / Recomendado',
    originalPrice: 'R$ 1.920,00',
    price: 'R$ 960,00',
    priceSub: 'R$ 120,00 por sessão (50% OFF Social)',
    paymentTerm: 'Pagamento via PIX ou Dinheiro antes de cada sessão',
    description: 'O programa completo de intervenção terapêutica que transforma bloqueios em autonomia de estudo e autoconfiança.',
    idealFor: 'Para destravar leitura, escrita, foco, matemática e rotina de estudos com acompanhamento intensivo.',
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
    whatsappMessage: 'Olá Dra. Raiane! Vim através da página de Atendimento Social e gostaria de solicitar a aprovação para o Plano Autonomia Social (Recomendado) do meu filho.'
  },
  {
    id: 'neuroafetivo-social',
    name: 'Neuroafetivo Social',
    subtitle: 'Acompanhamento Integral',
    badge: 'Cuidado Contínuo',
    originalPrice: 'R$ 4.320,00',
    price: 'R$ 2.160,00',
    priceSub: 'R$ 120,00 por sessão (50% OFF Social)',
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
    whatsappMessage: 'Olá Dra. Raiane! Vim através da página de Atendimento Social e gostaria de solicitar a aprovação para o Plano Neuroafetivo Social do meu filho.'
  }
];

const socialFaqs = [
  {
    q: 'O que é o Programa de Atendimento Social da Dra. Raiane?',
    a: 'É uma iniciativa voltada a democratizar o acesso à psicopedagogia clínica e neuropsicopedagogia de alta qualidade. Destinamos uma parte da nossa grade de horários para atender famílias de baixa renda com 50% de redução no investimento, mantendo exatamente o mesmo padrão de excelência clínica e dedicação.'
  },
  {
    q: 'Quem tem direito ao Atendimento Social e como funciona a aprovação?',
    a: 'O programa é destinado a famílias que comprovem ou relatem situação de vulnerabilidade financeira e que não teriam condições de arcar com os valores de consultas particulares convencionais. A aprovação é feita de maneira humanizada e sem burocracias humilhantes em uma breve conversa inicial diretamente com a Dra. Raiane pelo WhatsApp.'
  },
  {
    q: 'A qualidade, duração e materiais das sessões sociais são os mesmos?',
    a: 'Sim, 100% idênticos! Seu filho terá acesso aos mesmos instrumentos de testagem neurocognitiva, aos mesmos materiais pedagógicos lúdicos, reuniões com a coordenação da escola, devolutivas detalhadas e acesso irrestrito à plataforma do paciente para acompanhar o histórico e exercícios.'
  },
  {
    q: 'Como é feito o pagamento nos planos sociais?',
    a: 'O pagamento é feito sessão por sessão via PIX ou em Dinheiro (com até 24h de antecedência para confirmar a presença). Não há cobrança antecipada de mensalidades cheias, permitindo que a família organize seu orçamento sem aperto.'
  },
  {
    q: 'É emitido Recibo Profissional para os atendimentos sociais?',
    a: 'Sim. Ao final do plano contratado, emitimos o Recibo Profissional discriminando todas as sessões realizadas e os respectivos valores pagos, ficando disponível para download no Portal do Paciente para pedido de reembolso junto ao plano de saúde.'
  },
  {
    q: 'O atendimento social pode ser realizado online?',
    a: 'Sim! Atendemos crianças e famílias de todo o Brasil e do exterior pela nossa plataforma digital interativa, além do atendimento presencial no consultório em Ribeirão Preto/SP.'
  }
];

const SocialLandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const scrollToPlans = () => {
    const element = document.getElementById('planos-sociais');
    const lenis = (window as any).lenis;
    if (element) {
      if (lenis) {
        lenis.scrollTo(element, { offset: -80, duration: 1.2 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <SEO 
        title="Atendimento Social de Psicopedagogia | Dra. Raiane Ferreira"
        description="Programa de Atendimento Social em Psicopedagogia e Neuropsicopedagogia para famílias de baixa renda. Planos com 50% de redução mediante aprovação prévia."
      />
      <Header />

      <main className="flex-grow">
        
        {/* Social Hero Section */}
        <section id="inicio-social" className="pt-32 pb-20 px-4 flex flex-col items-center overflow-hidden">
          <div className="w-full max-w-7xl relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10"></div>

            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-pill text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-accent/20">
                  <HeartHandshake size={15} />
                  Programa de Atendimento Social • Dra. Raiane Ferreira
                </div>

                <h1 className="text-[length:var(--fluid-h1)] font-display font-bold text-primary leading-[1.1] mb-8">
                  Atendimento psicopedagógico de excelência ao <span className="text-accent">alcance da sua família</span>.
                </h1>

                <p className="text-[length:var(--fluid-body)] text-text/70 font-body leading-relaxed max-w-2xl mb-8 mx-auto lg:mx-0">
                  Acreditamos que nenhuma criança deve ter seu aprendizado e futuro limitados por condições financeiras. Por meio do nosso Programa de Atendimento Social, oferecemos os mesmos planos clínicos de referência com <strong className="text-primary font-bold">50% de redução no valor</strong> para famílias de baixa renda.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10 text-xs font-bold text-primary/80">
                  <span className="inline-flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-pill border border-primary/10">
                    🗓️ Vagas Sociais Limitadas por Mês
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-pill border border-primary/10">
                    🏠 Presencial & Online
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-pill border border-accent/20">
                    ✨ 50% de Redução
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <a
                    href="https://wa.me/5516991864393?text=Ol%C3%A1%20Dra.%20Raiane!%20Vim%20atrav%C3%A9s%20da%20p%C3%A1gina%20de%20Atendimento%20Social%20e%20gostaria%20de%20solicitar%20aprova%C3%A7%C3%A3o%20para%20uma%20vaga%20social%20para%20o%20meu%20filho."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackConversion('Contact', 'SocialHero_WhatsAppCTA', { campaign: 'social_care' })}
                    className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-pill shadow-premium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-base sm:text-lg group cursor-pointer"
                  >
                    <WhatsAppIcon size={22} className="group-hover:rotate-12 transition-transform" />
                    Solicitar Vaga no Atendimento Social
                  </a>

                  <button
                    onClick={scrollToPlans}
                    className="w-full sm:w-auto bg-white hover:bg-primary/5 text-primary border-2 border-primary/20 hover:border-primary font-bold py-4 px-7 rounded-pill shadow-ambient transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-base group cursor-pointer"
                  >
                    <span>Ver Planos Sociais (50% OFF)</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-accent" />
                  </button>
                </div>
              </div>

              <div className="flex-1 relative w-full max-w-xl group/image">
                <div className="relative aspect-[4/5] sm:aspect-square">
                  <div className="absolute inset-4 bg-accent/10 rounded-2xl -rotate-3 transition-transform group-hover/image:-rotate-1"></div>
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-ambient"></div>

                  <div className="relative w-full h-full rounded-2xl overflow-hidden border-8 border-white shadow-premium">
                    <img
                      src={heroImg}
                      alt="Raiane E. Ferreira - Psicopedagoga"
                      className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-1000"
                      loading="eager"
                    />
                  </div>

                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-premium animate-float hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <HeartHandshake size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Iniciativa</p>
                        <p className="text-sm font-bold text-primary">Inclusiva & Humana</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section 1: Pain Points */}
        <PainPoints />

        {/* Narrative Section 2: Methodology & Journey */}
        <Methodology />

        {/* Narrative Section 3: About Specialist */}
        <About />

        {/* Social Plans Horizontal Block Presentation */}
        <section id="planos-sociais" className="py-24 px-4 bg-surface/50 border-t border-b border-muted/20">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-pill text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-accent/20">
                <Sparkles size={14} />
                Valores Sociais • 50% de Redução para Famílias de Baixa Renda
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary leading-[1.1] mb-6">
                Investimento social no futuro e na <span className="text-accent">autonomia</span> do seu filho.
              </h2>

              <p className="text-text/70 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Mesma metodologia integrada, suporte à escola e acesso à plataforma com valor social facilitado mediante aprovação prévia.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-primary/80">
                <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-pill border border-muted/20 shadow-sm">
                  <ReceiptText size={16} className="text-primary" /> Recibo Profissional para Reembolso
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-pill border border-muted/20 shadow-sm">
                  <Clock size={16} className="text-primary" /> Presencial & Online
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-pill border border-muted/20 shadow-sm">
                  <GraduationCap size={16} className="text-primary" /> Integração com a Escola
                </span>
              </div>
            </div>

            {/* Horizontal Plans Layout */}
            <div className="flex flex-col gap-8 mb-20">
              {socialPlansData.map((plan) => (
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
                          <div className="mb-1">
                            <span className={`text-xs font-bold line-through tracking-wider block mb-0.5 ${
                              plan.highlight ? 'text-white/60' : 'text-text/50'
                            }`}>
                              de {plan.originalPrice}
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className={`text-4xl sm:text-5xl font-display font-bold ${plan.priceText}`}>
                                {plan.price}
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                plan.highlight ? 'bg-accent text-white' : 'bg-accent/15 text-accent'
                              }`}>
                                50% OFF
                              </span>
                            </div>
                          </div>
                          <p className={`text-xs font-bold mb-1.5 ${plan.highlight ? 'text-white/90' : 'text-primary'}`}>
                            {plan.priceSub}
                          </p>
                          <p className={`text-[11px] leading-snug flex items-center gap-1.5 ${
                            plan.highlight ? 'text-white/75' : 'text-text/60'
                          }`}>
                            <span>💵</span> {plan.paymentTerm}
                          </p>
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/5516991864393?text=${encodeURIComponent(plan.whatsappMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackConversion('Contact', `SocialPlan_${plan.name}`, { plan_type: 'social', plan_name: plan.name })}
                          className={`w-full py-4 px-6 rounded-pill flex items-center justify-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-ambient ${plan.btnClass}`}
                        >
                          <WhatsAppIcon size={18} />
                          Solicitar Vaga Social no {plan.name}
                        </a>
                        <p className={`text-center text-[10px] mt-2 ${plan.highlight ? 'text-white/60' : 'text-text/40'}`}>
                          Vagas sociais limitadas • Sujeito à aprovação prévia
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Scope, Target Profile & 2-Column Features Grid */}
                    <div className="flex-1 flex flex-col justify-between">
                      
                      {/* Target Profile Box */}
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed mb-6 font-body flex items-start gap-3 ${
                        plan.highlight ? 'bg-white/10 text-white/90 border border-white/10' : 'bg-white text-text/70 border border-muted/15 shadow-sm'
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
                                  : 'bg-white border border-muted/15 shadow-sm'
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

            {/* Social Pricing FAQ */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-2 block">
                  Dúvidas sobre o Programa Social
                </span>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-primary">
                  Perguntas Frequentes sobre o Atendimento Social
                </h3>
              </div>

              <div className="space-y-4">
                {socialFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx}
                      className="bg-white rounded-2xl border border-muted/20 overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <div className={`w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-accent text-white' : 'text-primary'
                        }`}>
                          <ChevronDown size={18} />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-0 font-body text-sm sm:text-base text-text/80 leading-relaxed border-t border-muted/10">
                          <p className="pt-4">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-premium selection:bg-accent selection:text-white">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-pill text-xs font-bold uppercase tracking-widest text-accent mb-6">
                  <MessageCircleQuestion size={16} />
                  Acolhimento & Triagem Social
                </div>

                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                  Deseja conversar sobre a situação do seu filho?
                </h2>

                <p className="text-white/80 font-body text-base mb-8 leading-relaxed">
                  Envie uma mensagem contando resumidamente a idade e a dificuldade do seu filho. A Dra. Raiane fará a triagem carinhosa e explicará a disponibilidade de horários da agenda social.
                </p>

                <a
                  href="https://wa.me/5516991864393?text=Ol%C3%A1%20Dra.%20Raiane!%20Gostaria%20de%20conversar%20sobre%20a%20agenda%20social%20para%20o%20meu%20filho."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackConversion('Contact', 'SocialPage_BottomHelpCTA', { campaign: 'social_care' })}
                  className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-pill shadow-premium transition-all duration-300 hover:scale-105 cursor-pointer text-sm sm:text-base uppercase tracking-wider"
                >
                  <WhatsAppIcon size={20} />
                  Falar com a Dra. Raiane no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton 
        message="Olá Dra. Raiane! Gostaria de conversar sobre a disponibilidade do Atendimento Social para o meu filho." 
        eventLabel="SocialPage_FloatingWhatsApp" 
      />
    </div>
  );
};

export default SocialLandingPage;
