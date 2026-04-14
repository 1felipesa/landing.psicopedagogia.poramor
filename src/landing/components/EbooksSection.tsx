import React from 'react';
import { BookOpen, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const EbooksSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white overflow-hidden" id="biblioteca">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10"></div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Recursos Gratuitos</span>
            
            <h2 className="text-4xl sm:text-5xl font-display font-black text-on-surface leading-[1.1] mb-8 text-editorial">
              Conhecimento que <span className="text-primary text-editorial">transforma</span> a sua casa.
            </h2>
            
            <p className="text-lg text-on-surface/60 font-body leading-relaxed max-w-xl mb-12 mx-auto lg:mx-0">
              Preparamos uma série de e-books e guias práticos gratuitos para pais e educadores. Baixe agora e tenha ferramentas reais para apoiar o desenvolvimento do seu filho.
            </p>

            <Link 
              to="/ebooks" 
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-full shadow-premium transition-all group"
            >
              Quero meus e-books
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 w-full max-w-lg order-1 lg:order-2 relative mt-10 lg:mt-0">
             {/* Background glowing orb */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-10"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
                        
             <div className="relative w-full aspect-square flex items-center justify-center">
                 
                 {/* Stacked Ebook Back 2 */}
                 <div className="absolute z-0 w-48 sm:w-56 h-64 sm:h-72 bg-white/40 backdrop-blur-sm rounded-[2rem] shadow-sm border border-white/50 transform -rotate-12 -translate-x-12 translate-y-6 transition-all duration-500 hover:-rotate-6 hover:-translate-x-14">
                 </div>

                 {/* Stacked Ebook Back 1 */}
                 <div className="absolute z-10 w-48 sm:w-56 h-64 sm:h-72 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-ambient border border-white transform rotate-6 translate-x-12 translate-y-2 transition-all duration-500 hover:rotate-12 hover:translate-x-16">
                 </div>

                 {/* Main Center Floating 'Ebook' */}
                 <div className="relative z-20 w-48 sm:w-56 h-64 sm:h-72 bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] shadow-premium flex flex-col p-6 sm:p-8 text-white border border-white/20 transform hover:-translate-y-4 transition-transform duration-500">
                     <div className="flex justify-between items-start mb-auto">
                        <div className="p-3 sm:p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                            <BookOpen size={28} strokeWidth={2} />
                        </div>
                        <Sparkles size={24} className="text-secondary/80" />
                     </div>
                     <div className="space-y-4">
                        <div>
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black text-white/70 block mb-2">Acervo Digital</span>
                            <div className="w-full h-4 bg-white/20 rounded-full mb-2"></div>
                            <div className="w-2/3 h-4 bg-white/20 rounded-full"></div>
                        </div>
                        <div className="w-1/3 h-2 bg-white/10 rounded-full"></div>
                     </div>
                 </div>

                 {/* Tag Badge */}
                 <div className="absolute -bottom-4 sm:-bottom-8 right-2 sm:right-8 bg-secondary text-white font-black px-5 py-4 sm:px-6 sm:py-5 rounded-2xl shadow-premium z-30 flex items-center gap-3 animate-float border border-white/20">
                    <Download size={20} strokeWidth={2.5} />
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] leading-none mt-1">100% Gratuito</span>
                 </div>

             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EbooksSection;
