import React from 'react';

const YouTubeSection: React.FC = () => {
    // Playlist ID derived from Channel ID (replacing 'UC' with 'UU' for the uploads playlist)
    const uploadsPlaylistId = 'UULRm2ZVbdPtyioo1wkc5zGQ';
    const youtubeUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`;

    return (
        <section id="conteudo" className="py-16 sm:py-24 px-4 bg-slate-50 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-finn-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-red-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" /></svg>
                    No YouTube
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6">
                    Nossa Próxima <span className="text-red-600 underline decoration-red-600/20 decoration-8 underline-offset-4">Estação</span>
                </h2>

                <p className="text-slate-600 font-medium text-base sm:text-lg max-w-2xl mx-auto mb-12 px-4">
                    Acompanhe nossos conteúdos educativos e dicas práticas para transformar o aprendizado em uma aventura divertida em casa.
                </p>

                <div className="w-full max-w-4xl mx-auto aspect-video rounded-[2.5rem] overflow-hidden adventure-border shadow-2xl bg-slate-900 relative group">
                    <iframe
                        className="w-full h-full"
                        src={youtubeUrl}
                        title="Sessão Mais Recente - Psicopedagogia por Amor"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="mt-12">
                    <a
                        href="https://www.youtube.com/@psicopedagogia.poramor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-full shadow-[0_6px_0_0_#b91c1c] active:shadow-none active:translate-y-1.5 transition-all text-lg group"
                    >
                        Ver todos os vídeos
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default YouTubeSection;
