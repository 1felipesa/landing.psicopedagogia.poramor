import React from 'react';
import { Award, Sparkles, Heart, TrendingDown, MessageCircle } from 'lucide-react';
import perfilImg from '../../assets/images/raiane-perfil.png';

const About: React.FC = () => {
    return (
        <section id="sobre" className="py-24 px-4 bg-white relative overflow-hidden felt-texture">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-surface to-transparent opacity-50"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
                    
                    {/* Media Column - Instagram Style */}
                    <div className="w-full lg:w-5/12 flex justify-center lg:justify-start">
                        <div className="flex flex-col items-center">
                            {/* Round Photo with Verification */}
                            <div className="relative mb-6 group">
                                <div className="w-64 h-64 rounded-full p-2 bg-gradient-to-tr from-primary to-secondary shadow-premium group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={perfilImg}
                                        alt="Raiane E. Ferreira - Psicopedagoga"
                                        className="w-full h-full object-cover rounded-full border-4 border-white grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                                        loading="lazy"
                                    />
                                </div>
                                {/* Verified Badge */}
                                <div className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full border-4 border-white shadow-premium">
                                    <Award size={24} fill="currentColor" />
                                </div>
                            </div>
                            
                            {/* Name and Handle */}
                            <div className="text-center mb-6">
                                <h3 className="text-3xl font-display font-black text-on-surface">
                                    Raiane Ferreira
                                </h3>
                                <p className="text-on-surface/50 font-body text-sm font-bold uppercase tracking-widest mt-1">Cofundadora Clínica</p>
                            </div>

                            {/* Keywords Chips */}
                            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                                <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">Neurociência</span>
                                <span className="px-4 py-1.5 bg-secondary/5 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full border border-secondary/10">Psicopedagogia</span>
                                <span className="px-4 py-1.5 bg-on-surface/5 text-on-surface/60 text-[10px] font-black uppercase tracking-widest rounded-full border border-on-surface/10">+8 Anos Experiência</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-7/12">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/5 text-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-secondary/10">
                            A Guia por Trás do Projeto
                        </div>

                        <h2 className="text-4xl sm:text-6xl font-display font-black text-on-surface mb-8 leading-[1.1] text-editorial">
                            Iluminando trilhas onde o <span className="text-primary">conhecimento</span> floresce.
                        </h2>

                        <div className="space-y-6 mb-12">
                            <p className="text-on-surface/70 text-lg sm:text-xl font-body leading-relaxed">
                                Prazer, eu sou a <span className="text-primary font-black">Raiane.</span> Minha missão é traduzir a complexidade da ciência em estratégias de afeto e desenvolvimento real.
                            </p>
                            <p className="text-on-surface/60 text-base sm:text-lg font-body leading-relaxed font-light">
                                Utilizo o legado de Piaget e Vygotsky como bússola, unindo-o às mais modernas <span className="text-on-surface font-bold">Práticas Baseadas em Evidências</span>. Acredito que cada barreira de aprendizado é, na verdade, um convite para uma nova forma de ensinar.
                            </p>
                        </div>

                        {/* Pillars of Authority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                            {[
                                { title: 'Ciência', desc: 'Base neurocientífica sólida.', icon: <Sparkles size={18} /> },
                                { title: 'Afeto', desc: 'O acolhimento é o primeiro passo.', icon: <Heart size={18} /> },
                                { title: 'Evidência', desc: 'Protocolos validados e seguros.', icon: <Award size={18} /> },
                                { title: 'Resultados', desc: 'Foco na autonomia do aluno.', icon: <TrendingDown className="rotate-180" size={18} /> }
                            ].map((pillar) => (
                                <div key={pillar.title} className="flex items-start gap-4">
                                    <div className="mt-1 text-primary">{pillar.icon}</div>
                                    <div>
                                        <h4 className="text-sm font-black text-on-surface uppercase tracking-widest">{pillar.title}</h4>
                                        <p className="text-xs text-on-surface/40 font-body">{pillar.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <button 
                                onClick={() => window.open('https://wa.me/5516991864393', '_blank')}
                                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-10 rounded-full shadow-premium transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                            >
                                <MessageCircle size={18} />
                                Agendar Conversa
                            </button>
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/30">
                                Disponível para Ribeirão Preto e Online
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
