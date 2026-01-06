
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-white">
      <div className="w-full max-w-5xl mx-auto bg-finn-blue rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-24 text-center relative overflow-hidden shadow-2xl group/cta">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>

        {/* Animated Orbs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover/cta:scale-125 transition-transform duration-700"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-lsp-purple/20 rounded-full blur-2xl group-hover/cta:scale-125 transition-transform duration-700"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-tight">Pronto para começar <br />a aventura?</h2>
          <p className="text-white/90 text-lg sm:text-2xl font-medium mb-12 max-w-3xl leading-relaxed">
            Agende uma conversa e vamos descobrir juntos como potenciar o aprendizado e transformar dificuldades em superpoderes.
          </p>

          <a
            href="https://wa.me/5516991864393"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-white hover:text-[#25D366] text-white font-black py-4 px-8 sm:py-6 sm:px-14 rounded-full shadow-[0_8px_0_0_#128c7e] hover:shadow-[0_8px_0_0_#e5e7eb] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3 sm:gap-4 text-lg sm:text-2xl group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform sm:w-8 sm:h-8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Agendar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
