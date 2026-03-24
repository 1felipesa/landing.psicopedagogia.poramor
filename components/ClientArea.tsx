import React from 'react';

const ClientArea: React.FC = () => {
    const features = [
        {
            title: 'Biblioteca de Sessões',
            description: 'Acesse resumos detalhados de cada encontro para reforçar o aprendizado em casa.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>
            )
        },
        {
            title: 'Central de Documentos',
            description: 'Laudos, relatórios e documentos de alta sempre à mão e organizados.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
            )
        },
        {
            title: 'Gestão Transparente',
            description: 'Acompanhe agenda de atendimentos e informações financeiras em tempo real.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            )
        }
    ];

    return (
        <section id="area-cliente" className="py-16 sm:py-24 px-4 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-lsp-purple/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-24">

                    {/* Mockup / Image Side */}
                    <div className="flex-1 relative w-full max-w-lg">
                        <div className="absolute inset-0 bg-lsp-purple/20 rounded-[3rem] rotate-3 translate-x-4 translate-y-4 blur-2xl"></div>

                        {/* The main "Window" mockup */}
                        <div className="relative bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden aspect-[4/3] group">
                            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex items-center gap-1.5 px-4">
                                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            </div>

                            <div className="mt-6 h-full bg-[#F8F9FE] p-4 flex flex-col gap-4">
                                {/* Sidebar Mockup */}
                                <div className="flex gap-4 h-full">
                                    <div className="w-20 hidden sm:flex flex-col gap-3 pt-4 items-center">
                                        <div className="w-8 h-8 rounded-lg bg-lsp-purple/20"></div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                                    </div>
                                    {/* Content Mockup */}
                                    <div className="flex-1 flex flex-col gap-4 pt-4">
                                        <div className="h-12 w-3/4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4">
                                            <div className="h-2 w-20 bg-slate-200 rounded"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-3">
                                                <div className="h-2 w-12 bg-lsp-purple/30 rounded mb-2"></div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                                                <div className="h-1.5 w-2/3 bg-slate-100 rounded mt-1"></div>
                                            </div>
                                            <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-3">
                                                <div className="h-2 w-12 bg-finn-blue/30 rounded mb-2"></div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                                                <div className="h-1.5 w-2/3 bg-slate-100 rounded mt-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verified Badge Hover Effect */}
                            <div className="absolute bottom-6 right-6 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 transition-transform group-hover:scale-110 duration-500">
                                <div className="w-10 h-10 bg-lsp-purple rounded-xl flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Acesso</p>
                                    <p className="text-xs font-black text-slate-900 uppercase">Seguro & Exclusivo</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content Side */}
                    <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lsp-purple/10 text-lsp-purple rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            Inovação no Cuidado
                        </div>

                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-6">
                            Conheça a <br />
                            <span className="text-lsp-purple underline decoration-lsp-purple/20 decoration-8 underline-offset-4">Área do Cliente</span>
                        </h2>

                        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl">
                            Desenvolvemos uma plataforma de gestão exclusiva para que a sua expedição pelo aprendizado seja organizada e transparente.
                            Um espaço dedicado para acompanhar cada conquista da jornada.
                        </p>

                        <div className="space-y-6 mb-10 w-full max-w-md">
                            {features.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lsp-purple shrink-0 border border-slate-100">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg mb-1">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="https://psicopedagogiaporamor.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-lsp-purple hover:bg-lsp-purple/90 text-white font-black py-3.5 px-6 sm:py-4 sm:px-8 rounded-full shadow-[0_6px_0_0_#7B1FA2] active:shadow-none active:translate-y-1.5 transition-all text-base sm:text-lg group"
                        >
                            Acessar minha área
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ClientArea;
