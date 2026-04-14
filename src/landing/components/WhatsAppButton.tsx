import React from 'react';
import { MessageCircle } from 'lucide-react';
import { trackConversion } from '../../utils/analytics';

const WhatsAppButton: React.FC = () => {
    return (
        <a
            href="https://wa.me/5516991864393"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion('Contact', 'BotaoFlutuanteWhatsApp')}
            className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-5 rounded-full shadow-premium hover:shadow-ambient hover:-translate-y-2 active:scale-95 transition-all duration-500 group"
            aria-label="Falar no WhatsApp"
        >
            <div className="absolute -top-14 right-0 bg-white text-on-surface text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-2xl shadow-premium opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap pointer-events-none border border-outline-variant/10 translate-y-2 group-hover:translate-y-0">
                Como posso ajudar? <span className="text-primary ml-1">Clique aqui</span>
                <div className="absolute bottom-[-5px] right-8 w-3 h-3 bg-white border-r border-b border-outline-variant/10 rotate-45"></div>
            </div>

            <MessageCircle size={32} strokeWidth={2} />
        </a>
    );
};

export default WhatsAppButton;
