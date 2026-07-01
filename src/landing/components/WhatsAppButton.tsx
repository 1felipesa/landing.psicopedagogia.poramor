import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { trackConversion } from '../../utils/analytics';

const WhatsAppButton: React.FC = () => {
    return (
        <a
            href="https://wa.me/5516991864393"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion('Contact', 'BotaoFlutuanteWhatsApp')}
            className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-5 rounded-pill shadow-premium hover:shadow-ambient hover:-translate-y-2 active:scale-95 transition-all duration-500 group cursor-pointer"
            aria-label="Falar no WhatsApp"
        >
            <div className="absolute -top-14 right-0 bg-white text-text text-[10px] font-bold uppercase tracking-widest py-3 px-6 rounded-xl shadow-premium opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap pointer-events-none border border-muted/10 translate-y-2 group-hover:translate-y-0">
                Como posso ajudar? <span className="text-primary ml-1">Clique aqui</span>
                <div className="absolute bottom-[-5px] right-8 w-3 h-3 bg-white border-r border-b border-muted/10 rotate-45"></div>
            </div>

            <WhatsAppIcon size={32} />
        </a>
    );
};

export default WhatsAppButton;
