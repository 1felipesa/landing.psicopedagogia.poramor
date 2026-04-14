
import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-lsp-purple/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-lsp-purple" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Política de Privacidade</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Atualizado em Abril de 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-10">
            
            <section className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-finn-blue" size={24} strokeWidth={3} />
                <h2 className="text-2xl font-black text-slate-900 m-0">1. Coleta de Dados</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Coletamos informações básicas como <strong>Nome, E-mail, Celular, Cidade e Profissão</strong> quando você solicita o download de nossos materiais gratuitos (e-books). Estes dados são fornecidos voluntariamente por você através de nossos formulários.
              </p>
            </section>

            <section className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-jake-yellow" size={24} strokeWidth={3} />
                <h2 className="text-2xl font-black text-slate-900 m-0">2. Finalidade do Tratamento</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-4">
                Em conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados)</strong>, informamos que seus dados serão utilizados para as seguintes finalidades específicos:
              </p>
              <ul className="space-y-3 text-slate-600 font-bold list-disc pl-6">
                <li>Envio do material solicitado para o seu e-mail.</li>
                <li>Criação de um banco de dados para contatos comerciais futuros.</li>
                <li>Envio de comunicações de marketing, novidades e promoções relacionadas à Psicopedagogia por Amor.</li>
                <li>Personalização de publicidade em plataformas como Google e Meta (Facebook/Instagram).</li>
              </ul>
            </section>

            <section className="bg-lsp-purple/5 p-8 rounded-[2rem] border-2 border-lsp-purple/10">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-lsp-purple" size={24} strokeWidth={3} />
                <h2 className="text-2xl font-black text-slate-900 m-0">3. Seus Direitos</h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Você tem o direito de, a qualquer momento, solicitar o acesso, retificação ou a <strong>exclusão definitiva</strong> de seus dados de nossa base. Para isso, basta entrar em contato conosco através do e-mail de suporte ou clicando no link de "cancelar inscrição" em qualquer uma de nossas comunicações automáticas.
              </p>
            </section>

            <section className="p-8 text-center bg-slate-900 rounded-[2.5rem] text-white">
              <h2 className="text-2xl font-black mb-4">Compromisso com a Segurança</h2>
              <p className="text-slate-400 font-medium max-w-2xl mx-auto">
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
