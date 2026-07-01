import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import SEO from './components/SEO';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Bypass: name="description" og:title og:description */}
      <SEO 
        title="Política de Privacidade"
        description="Informações sobre como coletamos, usamos e protegemos seus dados pessoais na Psicopedagogia por Amor, em conformidade com a LGPD."
      />
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Política de Privacidade</h1>
            <p className="text-text/50 font-bold uppercase tracking-widest text-sm">Atualizado em Abril de 2026</p>
          </div>

          <div className="space-y-10">
            
            <section className="bg-white p-8 rounded-2xl border border-muted/10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/5 rounded-xl">
                  <Eye className="text-primary" size={24} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary m-0">1. Coleta de Dados</h2>
              </div>
              <p className="text-text/70 font-body leading-relaxed">
                Coletamos informações básicas como <strong className="text-primary">Nome, E-mail, Celular, Cidade e Profissão</strong> quando você solicita o download de nossos materiais gratuitos (e-books). Estes dados são fornecidos voluntariamente por você através de nossos formulários.
              </p>
            </section>

            <section className="p-8 bg-white/50 rounded-2xl border border-muted/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <FileText className="text-accent" size={24} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary m-0">2. Finalidade do Tratamento</h2>
              </div>
              <p className="text-text/70 font-body leading-relaxed mb-4">
                Em conformidade com a <strong className="text-primary">LGPD (Lei Geral de Proteção de Dados)</strong>, informamos que seus dados serão utilizados para as seguintes finalidades específicos:
              </p>
              <ul className="space-y-3 text-text/60 font-body list-disc pl-6">
                <li>Envio do material solicitado para o seu e-mail.</li>
                <li>Criação de um banco de dados para contatos comerciais futuros.</li>
                <li>Envio de comunicações de marketing, novidades e promoções relacionadas à Psicopedagogia por Amor.</li>
                <li>Personalização de publicidade em plataformas como Google e Meta (Facebook/Instagram).</li>
              </ul>
            </section>

            <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Lock className="text-primary" size={24} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary m-0">3. Seus Direitos</h2>
              </div>
              <p className="text-text/70 font-body leading-relaxed">
                Você tem o direito de, a qualquer momento, solicitar o acesso, retificação ou a <strong className="text-primary">exclusão definitiva</strong> de seus dados de nossa base. Para isso, basta entrar em contato conosco através do e-mail de suporte ou clicando no link de "cancelar inscrição" em qualquer uma de nossas comunicações automáticas.
              </p>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-muted/10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/5 rounded-xl">
                  <ShieldCheck className="text-primary" size={24} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary m-0">4. Cookies e Rastreamento</h2>
              </div>
              <p className="text-text/70 font-body leading-relaxed mb-4">
                Utilizamos cookies e tecnologias de rastreamento semelhantes para analisar a performance do site, tráfego e personalizar conteúdos e anúncios de publicidade direcionada através do <strong>Google Analytics 4</strong> e do <strong>Meta Pixel (Facebook/Instagram)</strong>.
              </p>
              <p className="text-text/70 font-body leading-relaxed">
                O uso dessas tecnologias está condicionado ao seu consentimento prévio, o qual pode ser revogado ou ajustado por você a qualquer momento por meio das configurações de cookies ou limpando os dados de navegação.
              </p>
            </section>

            <section className="p-12 text-center bg-primary rounded-3xl text-white shadow-premium">
              <h2 className="text-3xl font-display font-bold mb-6">Compromisso com a Segurança</h2>
              <p className="text-white/80 font-body max-w-2xl mx-auto leading-relaxed">
                Implementamos medidas rigorosas de segurança para proteger suas informações contra acesso não autorizado ou uso indevido. Seus dados nunca serão vendidos para terceiros.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
