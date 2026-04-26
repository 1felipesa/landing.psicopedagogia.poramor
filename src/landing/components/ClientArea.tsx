import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, FileText, ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';

const ClientArea: React.FC = () => {
    const features = [
        {
            title: 'Biblioteca de Sessões',
            description: 'Resumos detalhados de cada encontro para reforçar o aprendizado.',
            icon: <FileText size={22} />
        },
        {
            title: 'Gestão Transparente',
            description: 'Acompanhe agenda e informações financeiras em tempo real.',
            icon: <Calendar size={22} />
        },
        {
            title: 'Acesso Seguro',
            description: 'Seus dados protegidos com tecnologia de ponta.',
            icon: <ShieldCheck size={22} />
        }
    ];

    return (
        <section id="area-cliente" className="py-24 px-4 bg-background border-y border-muted/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    <div className="flex-1 order-2 lg:order-1">
                        <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Portal Exclusivo</span>
                        <h2 className="text-3xl sm:text-5xl font-display font-bold text-primary leading-tight mb-8">
                            Toda a jornada na palma <br />
                            da sua <span className="text-accent">mão.</span>
                        </h2>

                        <p className="text-text/60 font-body text-base sm:text-lg leading-relaxed mb-12 max-w-xl">
                            Desenvolvemos uma plataforma exclusiva para que pais e escola acompanhem cada progresso com total transparência e organização.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                            {features.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-md bg-white shadow-premium flex items-center justify-center text-primary shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary text-base mb-1">{item.title}</h4>
                                        <p className="text-text/50 text-sm leading-snug">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-8 rounded-pill shadow-premium hover:bg-primary/90 transition-all group"
                        >
                            Acessar Informações
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1 order-1 lg:order-2 w-full max-w-lg relative">
                        {/* Background glowing orb */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-[120px] -z-10"></div>
                        
                        <div className="relative w-full aspect-square flex items-center justify-center">
                            
                            {/* Main Center Card */}
                            <div className="relative z-20 w-48 sm:w-56 h-64 sm:h-72 bg-gradient-to-br from-primary to-primary/80 rounded-md shadow-premium flex flex-col items-center justify-center text-white border border-white/20 transform hover:scale-105 transition-transform duration-500">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                                    <LockKeyhole size={40} strokeWidth={1.5} />
                                </div>
                                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-white/80">Área Privada</span>
                                <span className="text-2xl font-bold font-display mt-1">Portal</span>
                                
                                <div className="absolute -top-4 -right-4 text-white/20 w-16 h-16">
                                    <Sparkles size={64}/>
                                </div>
                            </div>

                            {/* Floating Card Left (Calendar) */}
                            <div className="absolute left-2 sm:left-6 top-1/4 z-10 w-32 h-32 bg-white/70 backdrop-blur-md rounded-md shadow-ambient border border-white/60 flex flex-col items-center justify-center text-primary/60 transform -rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110">
                                <Calendar size={32} strokeWidth={1.5} className="mb-2 text-primary" />
                                <div className="w-12 h-1.5 bg-primary/20 rounded-pill mt-2"></div>
                                <div className="w-8 h-1.5 bg-primary/10 rounded-pill mt-1"></div>
                            </div>

                            {/* Floating Card Right (Docs) */}
                            <div className="absolute right-2 sm:right-6 bottom-1/4 z-30 w-36 h-36 sm:w-40 sm:h-40 bg-white/90 backdrop-blur-md rounded-md shadow-premium border border-white flex flex-col items-center justify-center text-accent transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-110">
                                <FileText size={40} strokeWidth={1.5} className="mb-3" />
                                <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-60">Histórico</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ClientArea;
