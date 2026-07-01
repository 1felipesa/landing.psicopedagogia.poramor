import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ebookTitle: string;
  ebookLink: string;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ 
  isOpen, 
  onClose, 
  ebookTitle, 
  ebookLink
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: '',
    cidade: '',
    profissao: '',
    consentimento: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentimento) {
      alert("Por favor, aceite os termos de privacidade.");
      return;
    }

    setLoading(true);
    
    try {
      const GAS_URL = 'https://script.google.com/macros/s/AKfycbydDk4eH3LSeXZ869JFHhuLdVh8sf59fXeQkDJKcyiiYVlJ9H18C1lJXe18ueKWPssh/exec'; 
      
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ebook: ebookTitle })
      });

      setSubmitted(true);
      setLoading(false);
      
      // Integrar com GTM Data Layer para rastrear a conversão
      const dataLayer = (window as any).dataLayer || [];
      dataLayer.push({
        event: 'ebook_download',
        ebook_title: ebookTitle
      });
      
      // Inicia o download
      window.open(ebookLink, '_blank');
      
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({ nome: '', email: '', celular: '', cidade: '', profissao: '', consentimento: false });
      }, 3000);

    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');

    setFormData({ ...formData, celular: formatted });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-premium animate-in zoom-in-95 fade-in duration-500 border border-muted/10">
        
        {/* Header */}
        <div className="p-8 sm:p-12 pb-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 rounded-full bg-background flex items-center justify-center text-text/40 hover:bg-primary hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
          
          <div className="pr-12">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Quase lá</span>
            <h3 className="text-3xl font-display font-bold text-primary leading-tight mb-4">
              Acesso ao <span className="text-accent">Material.</span>
            </h3>
            <p className="text-text/60 font-body text-sm leading-relaxed">
              Preencha os campos abaixo para liberar o download do e-book: <br />
              <strong className="text-primary font-bold">"{ebookTitle}"</strong>
            </p>
          </div>
        </div>

        <div className="px-8 sm:px-12 pb-12">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
                <CheckCircle2 size={48} className="text-primary" />
              </div>
              <h4 className="text-2xl font-display font-bold text-primary mb-4">Tudo pronto!</h4>
              <p className="text-text/60 font-body">Seu material será aberto em uma nova guia.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label htmlFor="lead-nome" className="block text-[10px] font-bold text-text/40 uppercase tracking-[0.2em] mb-3 ml-2">Nome Completo</label>
                  <input 
                    id="lead-nome"
                    required
                    type="text"
                    placeholder="Como você prefere ser chamado?"
                    className="w-full bg-background border border-muted/5 rounded-xl px-6 py-4 font-body text-text focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-text/20 shadow-sm"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="lead-email" className="block text-[10px] font-bold text-text/40 uppercase tracking-[0.2em] mb-3 ml-2">E-mail</label>
                  <input 
                    id="lead-email"
                    required
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full bg-background border border-muted/5 rounded-xl px-6 py-4 font-body text-text focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-text/20 shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="lead-whatsapp" className="block text-[10px] font-bold text-text/40 uppercase tracking-[0.2em] mb-3 ml-2">WhatsApp</label>
                  <input 
                    id="lead-whatsapp"
                    required
                    type="text"
                    placeholder="(00) 00000-0000"
                    className="w-full bg-background border border-muted/5 rounded-xl px-6 py-4 font-body text-text focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-text/20 shadow-sm"
                    value={formData.celular}
                    onChange={handlePhoneChange}
                  />
                </div>

                <div>
                  <label htmlFor="lead-cidade" className="block text-[10px] font-bold text-text/40 uppercase tracking-[0.2em] mb-3 ml-2">Cidade</label>
                  <input 
                    id="lead-cidade"
                    required
                    type="text"
                    placeholder="Onde você mora?"
                    className="w-full bg-background border border-muted/5 rounded-xl px-6 py-4 font-body text-text focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-text/20 shadow-sm"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="lead-profissao" className="block text-[10px] font-bold text-text/40 uppercase tracking-[0.2em] mb-3 ml-2">Profissão</label>
                  <input 
                    id="lead-profissao"
                    required
                    type="text"
                    placeholder="Sua área de atuação"
                    className="w-full bg-background border border-muted/5 rounded-xl px-6 py-4 font-body text-text focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-text/20 shadow-sm"
                    value={formData.profissao}
                    onChange={(e) => setFormData({...formData, profissao: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <label htmlFor="lead-consentimento" className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative mt-1">
                    <input 
                      id="lead-consentimento"
                      type="checkbox"
                      className="peer sr-only"
                      checked={formData.consentimento}
                      onChange={(e) => setFormData({...formData, consentimento: e.target.checked})}
                    />
                    <div className="w-6 h-6 bg-background border border-muted/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={`scale-0 peer-checked:scale-100 transition-all ${formData.consentimento ? 'scale-100' : 'scale-0'}`}><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                  </div>
                  <span className="text-[11px] leading-relaxed text-text/40 font-body group-hover:text-text/60 transition-colors uppercase tracking-wide">
                    Aceito receber materiais educativos e novidades da <strong className="text-primary font-bold">Psicopedagogia por Amor</strong>, em conformidade com os <a href="/privacidade" target="_blank" className="text-primary underline">Termos de Privacidade</a>.
                  </span>
                </label>
              </div>

              <button 
                disabled={loading || !formData.consentimento}
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 px-10 rounded-pill shadow-premium transition-all flex items-center justify-center gap-3 text-lg mt-8 disabled:opacity-50 disabled:pointer-events-none group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Enviar e Baixar Grátis
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
