import React, { useState } from 'react';

const faqs = [
    {
        question: 'Quanto tempo dura a jornada (o tratamento)?',
        answer: 'Cada herói tem seu próprio ritmo! Não existe um tempo fixo, pois o processo depende da complexidade da queixa e da resposta da criança às intervenções. Geralmente, realizamos uma reavaliação a cada 6 meses para medir os tesouros conquistados e recalibrar a rota.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-finn-blue"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        ),
        color: 'bg-blue-50'
    },
    {
        question: 'Qual a diferença entre a Psicopedagogia e o Reforço Escolar?',
        answer: 'Ótima pergunta! O reforço foca no conteúdo da escola (ajudar a passar na prova de amanhã). A Psicopedagogia foca em como a criança aprende. Nós investigamos as funções cognitivas, emocionais e sociais para que ela tenha autonomia para aprender qualquer conteúdo, sozinha, no futuro.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-jake-yellow"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
        ),
        color: 'bg-yellow-50'
    },
    {
        question: 'Vocês atendem apenas crianças?',
        answer: 'Não! Atendemos públicos de todas as idades. Afinal, a aventura do aprendizado dura a vida inteira. Atendemos desde crianças em fase de alfabetização até adultos e idosos que buscam otimizar suas funções cognitivas ou que enfrentam desafios acadêmicos e profissionais.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-lsp-purple"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
        ),
        color: 'bg-purple-50'
    },
    {
        question: 'Como funciona o atendimento Online? É eficaz para crianças?',
        answer: 'Com certeza! Utilizamos plataformas interativas e jogos digitais que mantêm o engajamento lá no alto. O atendimento online exige uma mediação próxima e é planejado com o mesmo rigor científico do presencial, sendo uma excelente opção para famílias que buscam flexibilidade.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-grass-green"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
        ),
        color: 'bg-green-50'
    },
    {
        question: 'Eu recebo relatórios sobre o progresso do meu filho?',
        answer: 'Sim. A transparência é parte da nossa aliança. Periodicamente, realizamos sessões de devolutiva com os pais para apresentar o "Mapa de Evolução", discutindo os avanços registrados e os próximos desafios da jornada.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-finn-blue"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
        ),
        color: 'bg-blue-50'
    },
    {
        question: 'Preciso de encaminhamento médico para começar?',
        answer: 'Não é obrigatório. Se você notou sinais de que a jornada escolar está difícil, pode agendar uma "Missão de Descoberta" (avaliação) diretamente conosco. Se durante o processo notarmos a necessidade de um olhar médico (Neurologista, Psiquiatra), faremos o encaminhamento para os nossos parceiros de confiança.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
        ),
        color: 'bg-red-50'
    },
    {
        question: 'O que é a Área do Cliente?',
        answer: 'É a Plataforma de Gestão em Psicopedagogia desenvolvida sob medida para registrar tudo que fizermos! Lá você encontrará agenda de atendimento, biblioteca com o resumo de todas as suas sessões, acompanhamento dos objetivos a serem atingidos, formulário digital de pré-anamnese que irá nos ajudar a traçar nossos planos de ação, download de atividades personalizadas e outros documentos importantes e o acompanhamento financeiro do seu atendimento.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-lsp-purple"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        ),
        color: 'bg-purple-50'
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 sm:py-24 px-4 bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl text-center mb-10 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                    Dúvidas Frequentes
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 px-4">
                    Manual do <span className="text-lsp-purple underline decoration-lsp-purple/20 decoration-8 underline-offset-4">Viajante</span>
                </h2>
                <p className="text-slate-600 font-medium text-base sm:text-lg max-w-2xl mx-auto px-4">
                    Tudo o que você precisa saber antes de iniciarmos nossa aventura pelo conhecimento.
                </p>
            </div>

            <div className="w-full max-w-3xl space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`adventure-border !border-2 overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg border-lsp-purple/30' : 'border-slate-100 hover:border-slate-200 shadow-sm'
                            }`}
                    >
                        <button
                            id={`faq-button-${index}`}
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-content-${index}`}
                            className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 group bg-white focus:outline-none"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${faq.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                    {faq.icon}
                                </div>
                                <h3 className="font-black text-slate-900 text-sm sm:text-lg leading-tight">
                                    {faq.question}
                                </h3>
                            </div>
                            <div className={`shrink-0 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-lsp-purple' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </button>

                        <div
                            id={`faq-content-${index}`}
                            role="region"
                            aria-labelledby={`faq-button-${index}`}
                            className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-0 ml-0 sm:ml-16">
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
