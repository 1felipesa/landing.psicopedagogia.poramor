
import React from 'react';
import heroImg from '../src/assets/images/hero.png';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="pt-28 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white adventure-border shadow-2xl p-6 sm:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 sm:gap-12">
        {/* Background Blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-jake-yellow/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-finn-blue/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100/80 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-slate-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#258CF4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" stroke="#fff" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Psicopedagogia Clínica
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
            Aprender é a <br />
            maior <span className="text-finn-blue">aventura</span> <br />
            da vida!
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-xl mb-10 mx-auto lg:mx-0">
            Transformando dificuldades em superpoderes através da <span className="text-lsp-purple font-bold">Psicopedagogia</span> Clínica. <br />
            Atendimento especializado presencial em Ribeirão Preto ou online para todo o mundo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href="https://wa.me/5516991864393"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-3.5 px-6 sm:py-4 sm:px-8 rounded-full shadow-[0_6px_0_0_#128c7e] active:shadow-none active:translate-y-1.5 transition-all flex items-center justify-center gap-3 text-base sm:text-lg group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform sm:w-6 sm:h-6" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Agendar no WhatsApp
            </a>
          </div>
        </div>

        <div className="flex-1 relative z-10 w-full max-w-md group/image">
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-jake-yellow rounded-[3rem] rotate-6 transform translate-y-4 translate-x-4 shadow-xl transition-transform group-hover/image:rotate-2"></div>
            <div className="absolute inset-0 bg-finn-blue rounded-[3rem] -rotate-3 opacity-20 shadow-xl transition-transform group-hover/image:rotate-2"></div>
            <div className="relative w-full h-full bg-[#E5E5E5] rounded-[3rem] border-8 border-white overflow-hidden shadow-xl flex items-center justify-center">
              <img
                src={heroImg}
                alt="Retrato profissional de Raiane E. Ferreira - Psicopedagoga Clínica"
                className="w-full h-full object-cover grayscale-[20%] group-hover/image:grayscale-0 transition-all duration-500"
                loading="eager"
              />
            </div>

            {/* Achievement Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border-b-4 border-slate-100 flex items-center gap-2 sm:gap-3 animate-float whitespace-nowrap">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              </div>
              <div>
                <span className="block text-[8px] sm:text-[10px] font-black uppercase text-slate-400 leading-none">Especialista em</span>
                <span className="block text-xs sm:text-sm font-black text-slate-900">Aprendizagem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
