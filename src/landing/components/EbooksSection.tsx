import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Ebook {
  titulo: string;
  descricao: string;
  linkDrive: string;
}

const EbooksSection: React.FC = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const GAS_URL = 'https://script.google.com/macros/s/AKfycbydDk4eH3LSeXZ869JFHhuLdVh8sf59fXeQkDJKcyiiYVlJ9H18C1lJXe18ueKWPssh/exec'; 
        const response = await fetch(GAS_URL);
        const data = await response.json();
        setEbooks(data.slice(0, 8)); // Pegamos os 8 mais recentes para a home
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar e-books para a home:", error);
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  const extractDriveId = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                  url.match(/id=([a-zA-Z0-9_-]{25,})/) ||
                  url.match(/\/folders\/([a-zA-Z0-9_-]{25,})/);
    return match ? match[1] : (url.match(/[a-zA-Z0-9_-]{25,}/)?.[0] || null);
  };

  const getThumbnailUrl = (driveUrl: string) => {
    const id = extractDriveId(driveUrl);
    if (!id) return "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop";
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000&authuser=0`;
  };

  return (
    <section className="py-24 px-4 bg-white overflow-hidden" id="biblioteca">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10"></div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Recursos Gratuitos</span>
            
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary leading-[1.1] mb-8">
              Conhecimento que <span className="text-accent">transforma</span> a sua casa.
            </h2>
            
            <p className="text-lg text-text/60 font-body leading-relaxed max-w-xl mb-12 mx-auto lg:mx-0">
              Preparamos uma série de e-books e guias práticos gratuitos para pais e educadores. 
              Baixe agora e tenha ferramentas reais para apoiar o desenvolvimento do seu filho.
            </p>

            <Link 
              to="/ebooks" 
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-pill shadow-premium transition-all group"
            >
              Acessar Biblioteca de Materiais
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 w-full order-1 lg:order-2 relative mt-12 lg:mt-0">
             <div className="relative w-full flex items-center overflow-hidden py-12 mask-fade-horizontal">
                
                {loading ? (
                  <div className="flex gap-8 animate-pulse w-full justify-center">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="w-52 h-72 bg-white rounded-md shadow-premium border border-muted/10 flex-shrink-0"></div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-8 animate-marquee-horizontal will-change-transform py-4">
                    {/* Quádrupla lista para garantir um fluxo horizontal contínuo e denso */}
                    {[...ebooks, ...ebooks, ...ebooks, ...ebooks].map((ebook, idx) => (
                      <div 
                        key={idx}
                        className="w-56 sm:w-64 h-72 sm:h-80 bg-white rounded-md shadow-premium border border-muted/5 overflow-hidden flex-shrink-0 transform transition-all hover:scale-105 hover:-translate-y-2 hover:shadow-2xl duration-500 relative group"
                      >
                        <div className="absolute inset-0 bg-muted/10 animate-pulse -z-10"></div>
                        <img 
                          src={getThumbnailUrl(ebook.linkDrive)} 
                          alt={ebook.titulo}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                             e.currentTarget.src = "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center text-white backdrop-blur-[4px]">
                          <span className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4 border-b border-white/30 pb-2 leading-tight">{ebook.titulo}</span>
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                            <Download size={24} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Overlays for Visual Depth */}
                <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-r from-white via-transparent to-white"></div>
             </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-h {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee-horizontal {
          animation: marquee-h 40s linear infinite;
        }
        .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
        .will-change-transform {
          will-change: transform;
        }
        .mask-fade-horizontal {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}} />
    </section>
  );
};

export default EbooksSection;
