
import React from 'react';
import perfilImg from '../src/assets/images/raiane-perfil.png';

const About: React.FC = () => {
  return (
    <section id="sobre" className="py-16 sm:py-24 px-4 bg-white flex flex-col items-center">
      <div className="w-full max-w-4xl text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-finn-blue/10 text-finn-blue rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Conheça a Mentora
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
          A <span className="text-finn-blue underline decoration-finn-blue/20 decoration-8 underline-offset-4">Guia</span> da Jornada
        </h2>
      </div>

      <div className="w-full max-w-5xl bg-[#F8FAFC] rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 border-2 border-slate-100 flex flex-col md:flex-row items-center gap-8 sm:gap-16">
        <div className="shrink-0 relative group">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-finn-blue overflow-hidden shadow-2xl transition-transform group-hover:rotate-3 group-hover:scale-105">
            <img
              src={perfilImg}
              alt="Raiane E. Ferreira sorrindo - Psicopedagoga"
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-4 right-4 bg-finn-blue text-white p-3 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">Raiane E. Ferreira</h3>
          <p className="font-bold text-lg mb-6"><span className="text-lsp-purple">Psicopedagogia</span> <span className="text-slate-900">Clínica</span></p>

          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            "Olá! Eu sou a Raiane, sua mentora nesta expedição pelo saber. Minha missão é iluminar as trilhas da aprendizagem utilizando o conhecimento de mestres como <span className="text-slate-900 font-bold">Piaget, Vygotsky e Jorge Visca</span>.
            Com um olhar voltado para as <span className="text-slate-900 font-bold">Práticas Baseadas em Evidências (PBE)</span>, eu ajudo cada aprendiz a desbravar o 'Reino do Conhecimento', transformando barreiras em pontes e dúvidas em autonomia."
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {['#Neurociência', '#Afetividade', '#Ludicidade', '#Inclusão'].map((tag) => (
              <span key={tag} className="px-5 py-2 bg-lsp-purple rounded-xl text-xs font-black text-white shadow-md uppercase tracking-tighter transition-all hover:scale-105 hover:shadow-lg cursor-default border border-lsp-purple/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
