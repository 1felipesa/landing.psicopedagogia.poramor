import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LeadFormModal from './components/LeadFormModal';
import { Download, Search, LayoutGrid, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from './components/SEO';

interface Ebook {
  titulo: string;
  descricao: string;
  linkDrive: string;
}

const EbooksPage: React.FC = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Garantir que a página comece no topo
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const GAS_URL = 'https://script.google.com/macros/s/AKfycbydDk4eH3LSeXZ869JFHhuLdVh8sf59fXeQkDJKcyiiYVlJ9H18C1lJXe18ueKWPssh/exec'; 
        
        console.log("Buscando e-books de:", GAS_URL);
        const response = await fetch(GAS_URL);
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        const data = await response.json();
        setEbooks(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar e-books:", error);
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  const extractDriveId = (url: string) => {
    // Busca o ID após /d/ ou id= ou /folders/
    const match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                  url.match(/id=([a-zA-Z0-9_-]{25,})/) ||
                  url.match(/\/folders\/([a-zA-Z0-9_-]{25,})/);
    return match ? match[1] : (url.match(/[a-zA-Z0-9_-]{25,}/)?.[0] || null);
  };

  const getThumbnailUrl = (driveUrl: string) => {
    const id = extractDriveId(driveUrl);
    if (!id) return "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop";
    
    // Tentando o endpoint de thumbnail com um parâmetro extra de segurança
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000&authuser=0`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop";
  };

  const filteredEbooks = ebooks.filter(ebook => 
    ebook.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadClick = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <SEO 
        title="Materiais e E-books Gratuitos"
        description="Baixe gratuitamente nossos materiais e e-books sobre TDAH, dificuldades de aprendizagem, alfabetização e muito mais para pais e educadores."
      />
      <Header />
      
      <main className="flex-grow pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
            <div className="max-w-2xl">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-[0.2em] mb-6 group"
              >
                <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
                Voltar para o Início
              </Link>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-primary leading-[1.1] mb-8">
                Biblioteca de <span className="text-accent">Conhecimento.</span>
              </h1>
              <p className="text-text/60 font-body text-lg leading-relaxed">
                Recursos Práticos Baseados em Evidências para pais e educadores que buscam transformar o aprendizado através do afeto e da ciência.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group w-full lg:max-w-sm">
              <label htmlFor="ebook-search" className="sr-only">Pesquisar materiais</label>
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-text/30 group-focus-within:text-primary transition-colors">
                <Search size={20} />
              </div>
              <input 
                id="ebook-search"
                type="text" 
                placeholder="Busque por temas (Ex: TDAH, Alfabetização...)"
                className="w-full bg-white border border-muted/10 rounded-pill pl-14 pr-8 py-5 text-lg font-body text-text focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-ambient"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <Sparkles size={20} />
                </div>
              </div>
              <p className="text-text/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                Organizando materiais...
              </p>
            </div>
          ) : filteredEbooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEbooks.map((ebook, idx) => (
                <div 
                  key={idx}
                  className="group bg-white rounded-md overflow-hidden transition-all duration-500 shadow-ambient hover:shadow-premium flex flex-col h-full border border-muted/5"
                >
                  {/* Card Image */}
                  <div className="aspect-[16/10] overflow-hidden bg-background relative shrink-0">
                    <img 
                      src={getThumbnailUrl(ebook.linkDrive)} 
                      alt={ebook.titulo}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
                  </div>
 
                  {/* Card Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">Material Gratuito</span>
                      <h3 className="text-2xl font-display font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                        {ebook.titulo}
                      </h3>
                      <p className="text-text/60 font-body text-sm leading-relaxed mb-8 line-clamp-3">
                        {ebook.descricao}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleDownloadClick(ebook)}
                      className="w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-4 px-6 rounded-pill shadow-premium transition-all flex items-center justify-center gap-3 group/btn mt-auto"
                    >
                      <Download size={18} className="group-hover/btn:translate-y-1 transition-transform" />
                      Baixar Material
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-md border border-dashed border-muted/30">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-8">
                <LayoutGrid size={32} className="text-text/20" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">Nada encontrado</h3>
              <p className="text-text/40 font-body max-w-xs mx-auto mt-4">
                Não localizamos materiais para o termo "{searchTerm}".
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />

      {selectedEbook && (
        <LeadFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ebookTitle={selectedEbook.titulo}
          ebookLink={selectedEbook.linkDrive}
        />
      )}
    </div>
  );
};

export default EbooksPage;
