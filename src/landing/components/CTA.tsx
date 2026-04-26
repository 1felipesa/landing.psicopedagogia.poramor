import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { trackConversion } from '../../utils/analytics';

const CTA: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="w-full max-w-7xl mx-auto bg-primary rounded-md p-10 sm:p-24 text-center relative overflow-hidden shadow-ambient group/cta">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] -z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-[11px] mb-6 block">Vamos Conversar?</span>
          
          <h2 className="text-4xl sm:text-6xl xl:text-7xl font-display font-bold text-white mb-10 leading-[1.1] max-w-4xl">
            Pronto para ver seu filho <span className="text-accent">florescer?</span>
          </h2>
          
          <p className="text-white/80 text-lg sm:text-xl font-body mb-14 max-w-2xl leading-relaxed">
            Agende uma conversa inicial e vamos descobrir juntos como destravar o potencial que já existe aí.
          </p>

          <a
            href="https://wa.me/5516991864393"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion('Contact', 'CTAFooterPrincipal')}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold py-6 px-12 rounded-pill shadow-premium transition-all flex items-center justify-center gap-4 text-xl group"
          >
            <MessageCircle size={24} strokeWidth={2.5} />
            Agendar no WhatsApp
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
