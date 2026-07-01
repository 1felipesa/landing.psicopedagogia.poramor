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
                    
                    <div className="flex-1">
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
                                <div key={item.title} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center text-primary shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary text-base mb-1">{item.title}</h4>
                                        <p className="text-text/50 text-sm leading-snug">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/area-cliente"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-8 rounded-pill shadow-premium hover:bg-primary/90 transition-all group cursor-pointer"
                        >
                            Conhecer Portal do Cliente
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="flex-1 w-full max-w-lg relative">
                        {/* Background glowing orb */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-[120px] -z-10"></div>

                        <div className="relative w-full bg-white/40 backdrop-blur-lg border border-white/60 rounded-3xl p-6 sm:p-8 shadow-premium overflow-hidden">
                            {/* Dashboard header mockup */}
                            <div className="flex items-center justify-between border-b border-primary/5 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-display text-sm">
                                        LS
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-primary text-xs uppercase tracking-wider">Lucas S.</h5>
                                        <p className="text-[10px] text-text/50 font-body">Paciente • 8 anos</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                                    Ativo
                                </span>
                            </div>

                            {/* Dashboard widgets */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Next Session */}
                                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Próxima Sessão</span>
                                        <Calendar size={16} className="text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary">04/07 às 14:00</p>
                                        <p className="text-[10px] text-text/50 mt-1 font-body">Presencial • Ribeirão Preto</p>
                                    </div>
                                </div>

                                {/* Evolution Metrics */}
                                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Desempenho</span>
                                        <ShieldCheck size={16} className="text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <div className="flex justify-between text-[9px] font-bold text-primary mb-1">
                                                <span>Foco e Atenção</span>
                                                <span>85%</span>
                                            </div>
                                            <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[9px] font-bold text-accent mb-1">
                                                <span>Autonomia</span>
                                                <span>70%</span>
                                            </div>
                                            <div className="h-1.5 bg-accent/15 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent rounded-full" style={{ width: '70%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback Note */}
                                <div className="sm:col-span-2 bg-gradient-to-br from-primary/5 to-primary/0 backdrop-blur-md rounded-2xl p-4 border border-primary/10 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText size={14} className="text-primary" />
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Último Relatório Clínico</span>
                                    </div>
                                    <p className="text-xs text-text/70 font-body leading-relaxed italic">
                                        "Lucas demonstrou grande evolução no processamento fonológico hoje. Destravou a decodificação de sílabas complexas com o uso lúdico da Cogni e da Afetina."
                                    </p>
                                    <p className="text-[10px] text-primary/70 font-bold text-right mt-2">— Dra. Raiane E. Ferreira</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ClientArea;
