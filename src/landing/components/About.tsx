import React from 'react';
import { Award, Sparkles, Heart, TrendingDown, MessageCircle } from 'lucide-react';
import perfilImg from '../../assets/images/raiane-perfil.png';

const About: React.FC = () => {
    return (
        <section id="sobre" className="py-24 px-4 bg-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background to-transparent opacity-50"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Media Column - Arch Frame */}
                    <div className="w-full lg:w-4/12 flex justify-center lg:justify-start">
                        <div className="relative group">
                            {/* Arch FrameRecorte em arco */}
                            <div className="w-[300px] h-[400px] sm:w-[350px] sm:h-[460px] relative overflow-hidden rounded-t-full shadow-premium">
                                <img
                                    src={perfilImg}
                                    alt="Raiane E. Ferreira - Psicopedagoga"
                                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                                    loading="lazy"
                                />
                            </div>
                            
                            {/* Accent Badge */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent flex items-center justify-center rounded-full border-8 border-white shadow-premium animate-bounce-subtle">
                                <Heart size={32} className="text-white fill-white" />
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-8/12">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 text-primary rounded-pill text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-primary/10">
                            A Especialista
                        </div>

                        <h2 className="text-4xl sm:text-6xl font-display font-bold text-primary mb-8 leading-[1.1]">
                            Iluminando caminhos onde o <span className="text-accent">conhecimento</span> floresce com afeto.
                        </h2>

                        <div className="space-y-6 mb-12">
                            <p className="text-text/80 text-lg sm:text-xl font-body leading-relaxed max-w-3xl">
                                Prazer, eu sou a <span className="text-primary font-bold">Raiane.</span> Minha missão é traduzir a ciência em estratégias de afeto e desenvolvimento real.
                            </p>
                            <p className="text-text/60 text-base sm:text-lg font-body leading-relaxed max-w-3xl">
                                Utilizo o legado de Piaget e Vygotsky unindo-o às mais modernas práticas baseadas em evidências. Acredito que cada barreira é um convite para uma nova forma de ensinar.
                            </p>
                        </div>

                        {/* Pillars of Authority - Credential Badge Style */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            {[
                                { title: 'Pós-graduada em Neuropsicopedagogia', icon: <Sparkles size={18} /> },
                                { title: 'Especialista em Dificuldades de Aprendizagem', icon: <Heart size={18} /> },
                                { title: 'Atendimento Humanizado & Personalizado', icon: <Award size={18} /> },
                                { title: 'Foco em Autonomia e Funções Executivas', icon: <TrendingDown size={18} /> }
                            ].map((pillar) => (
                                <div key={pillar.title} className="bg-background p-4 rounded-md border-l-4 border-accent flex items-center gap-4 hover:bg-white hover:shadow-premium transition-all">
                                    <div className="text-accent">{pillar.icon}</div>
                                    <h4 className="text-sm font-display font-bold text-primary">{pillar.title}</h4>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <button 
                                onClick={() => window.open('https://wa.me/5516991864393', '_blank')}
                                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold py-5 px-10 rounded-pill shadow-premium transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                            >
                                <MessageCircle size={18} />
                                Agendar Conversa
                            </button>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                                Ribeirão Preto | Online
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
