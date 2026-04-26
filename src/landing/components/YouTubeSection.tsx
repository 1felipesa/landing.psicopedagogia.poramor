import React, { useState, useEffect } from 'react';
import { PlayCircle, ArrowRight, Video, Loader2 } from 'lucide-react';

interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
}

const YouTubeSection: React.FC = () => {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const API_KEY = 'AIzaSyBAzx6LzHNvsXDPKddbFtM_RL2i-H1AkDI';
    const UPLOADS_PLAYLIST_ID = 'UULRm2ZVbdPtyioo1wkc5zGQ';

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Usando playlistItems em vez de search para maior estabilidade e menor consumo de cota
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${UPLOADS_PLAYLIST_ID}&part=snippet&maxResults=6`
                );
                const data = await response.json();
                
                if (data.items) {
                    const fetchedVideos = data.items.map((item: any) => ({
                        id: item.snippet.resourceId.videoId,
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails.high.url
                    }));
                    setVideos(fetchedVideos);
                    setActiveVideoId(fetchedVideos[0].id);
                }
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar vídeos do YouTube:", error);
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <section id="conteudo" className="py-24 px-4 bg-background relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-pill text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-red-100">
                    <Video size={16} strokeWidth={2.5} />
                    Conteúdo em Vídeo
                </div>

                <h2 className="text-3xl sm:text-5xl font-display font-bold text-primary mb-8 leading-tight max-w-4xl mx-auto">
                    Transformando o aprendizado através de <span className="text-red-600">telas e afeto.</span>
                </h2>

                <p className="text-text/60 font-body text-base sm:text-lg max-w-2xl mx-auto mb-16">
                    No nosso canal compartilhamos dicas práticas, estratégias de intervenção e muito acolhimento para a sua jornada educativa.
                </p>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="text-red-600 animate-spin" size={40} />
                        <span className="text-text/40 font-bold uppercase tracking-widest text-[10px]">Carregando canal...</span>
                    </div>
                ) : videos.length > 0 ? (
                    <div className="w-full max-w-6xl mx-auto animate-in fade-in zoom-in duration-700">
                        {/* Main Player */}
                        <div className="relative aspect-video rounded-md overflow-hidden shadow-2xl bg-black border-4 sm:border-8 border-white mb-10 group">
                            {activeVideoId && (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=0`}
                                    title="Vídeo Principal - YouTube Section"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>

                        {/* Thumbnails Carousel */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {videos.map((video) => (
                                <button
                                    key={video.id}
                                    onClick={() => setActiveVideoId(video.id)}
                                    className={`relative aspect-video rounded-md overflow-hidden transition-all duration-300 group ${
                                        activeVideoId === video.id 
                                        ? 'ring-4 ring-red-600 ring-offset-2 scale-95 shadow-lg' 
                                        : 'hover:scale-105 shadow-md opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img 
                                        src={video.thumbnail} 
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="text-white" size={24} />
                                    </div>
                                    {activeVideoId === video.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl mx-auto p-12 rounded-md bg-white border border-muted/10 shadow-premium flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                            <Video size={40} />
                        </div>
                        <div className="max-w-md">
                            <h4 className="text-xl font-display font-bold text-primary mb-2">Acesse nosso canal completo</h4>
                            <p className="text-text/60 font-body text-sm">
                                Não conseguimos carregar os vídeos recentes agora, mas você pode conferir todo o nosso conteúdo diretamente no YouTube.
                            </p>
                        </div>
                        <a
                            href="https://www.youtube.com/@psicopedagogia.poramor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-pill transition-all flex items-center gap-2"
                        >
                            <PlayCircle size={20} />
                            Abrir Galeria de Vídeos
                        </a>
                    </div>
                )}

                <div className="mt-16">
                    <a
                        href="https://www.youtube.com/@psicopedagogia.poramor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-10 rounded-pill shadow-premium transition-all text-lg group"
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
