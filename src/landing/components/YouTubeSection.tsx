import React from 'react';
import { PlayCircle, ArrowRight } from 'lucide-react';

const YouTubeSection: React.FC = () => {
    // Playlist ID derived from Channel ID (replacing 'UC' with 'UU' for the uploads playlist)
    const uploadsPlaylistId = 'UULRm2ZVbdPtyioo1wkc5zGQ';
    const youtubeUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`;

    return (
        <section id="conteudo" className="py-24 px-4 bg-surface relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-red-100">
                    <PlayCircle size={16} strokeWidth={2.5} />
                    Conteúdo em Vídeo
                </div>

                <h2 className="text-3xl sm:text-5xl font-display font-black text-on-surface mb-8 leading-tight text-editorial max-w-4xl mx-auto">
                    Transformando o aprendizado através de <span className="text-red-600">telas e afeto.</span>
                </h2>

                <p className="text-on-surface/60 font-body text-base sm:text-lg max-w-2xl mx-auto mb-16">
                    No nosso canal compartilhamos dicas práticas, estratégias de intervenção e muito acolhimento para a sua jornada educativa.
                </p>

                <div className="w-full max-w-5xl mx-auto aspect-video rounded-[3rem] overflow-hidden shadow-ambient bg-on-surface relative group border-8 border-white">
                    <iframe
                        className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        src={youtubeUrl}
                        title="Sessão Mais Recente - Psicopedagogia por Amor"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="mt-16">
                    <a
                        href="https://www.youtube.com/@psicopedagogia.poramor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-10 rounded-full shadow-premium transition-all text-lg group"
                    >
                        Inscreva-se no Canal
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default YouTubeSection;
