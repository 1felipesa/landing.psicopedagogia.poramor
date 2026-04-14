import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LeadFormModal from './components/LeadFormModal';
import { BookOpen, Download, Search, LayoutGrid, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (driveUrl: string) => {
    const id = extractDriveId(driveUrl);
    if (!id) return "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=1000&auto=format&fit=crop";
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
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
    <div className="min-h-screen bg-surface flex flex-col font-body">
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
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Voltar para o Início
              </Link>
              <h1 className="text-4xl md:text-6xl font-display font-black text-on-surface leading-[1.1] mb-8 text-editorial">
                Biblioteca de <span className="text-primary">Conhecimento.</span>
              </h1>
              <p className="text-on-surface/60 font-body text-lg leading-relaxed">
                Recursos Práticos Baseados em Evidências para pais e educadores que buscam transformar o aprendizado através do afeto e da ciência.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative group w-full lg:max-w-sm">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface/20 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="O que você está procurando?"
                className="w-full bg-white border border-outline-variant/10 rounded-full py-5 pl-14 pr-6 font-body text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-ambient"
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
              <p className="text-on-surface/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                Organizando materiais...
              </p>
            </div>
          ) : filteredEbooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEbooks.map((ebook, idx) => (
                <div 
                  key={idx}
                  className="group bg-white rounded-[3rem] overflow-hidden transition-all duration-500 shadow-ambient hover:shadow-premium flex flex-col h-full border border-outline-variant/5"
                >
                  {/* Card Image */}
                  <div className="aspect-[16/10] overflow-hidden bg-surface relative shrink-0">
                    <img 
                      src={getThumbnailUrl(ebook.linkDrive)} 
                      alt={ebook.titulo}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
                  </div>
 
                  {/* Card Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">Material Gratuito</span>
                      <h3 className="text-2xl font-display font-black text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">
                        {ebook.titulo}
                      </h3>
                      <p className="text-on-surface/60 font-body text-sm leading-relaxed mb-8 line-clamp-3">
                        {ebook.descricao}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleDownloadClick(ebook)}
                      className="w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-4 px-6 rounded-full shadow-premium transition-all flex items-center justify-center gap-3 group/btn mt-auto"
                    >
                      <Download size={18} className="group-hover/btn:translate-y-1 transition-transform" />
                      Baixar Material
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-outline-variant/30">
              <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-8">
                <LayoutGrid size={32} className="text-on-surface/20" />
              </div>
              <h3 className="text-2xl font-display font-black text-on-surface">Nada encontrado</h3>
              <p className="text-on-surface/40 font-body max-w-xs mx-auto mt-4">
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
