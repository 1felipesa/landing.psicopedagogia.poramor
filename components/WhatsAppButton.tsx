import React from 'react';

const WhatsAppButton: React.FC = () => {
    return (
        <a
            href="https://wa.me/5516991864393"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_24px_rgba(37,211,102,0.5)] hover:-translate-y-2 active:translate-y-0 transition-all duration-300 group animate-bounce-subtle"
            aria-label="Falar no WhatsApp"
        >
            <div className="absolute -top-12 right-1/2 translate-x-1/2 bg-white text-slate-900 text-xs font-black py-2 px-4 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100 mb-2">
                Precisa de ajuda? <span className="text-lsp-purple">Chame aqui!</span>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
            </div>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-8 sm:h-8"
            >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
        </a>
    );
};

export default WhatsAppButton;
