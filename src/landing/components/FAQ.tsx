import React, { useState } from 'react';
import { ChevronDown, Target, Headphones, Book, Clipboard, Lock, Brain } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

const faqs = [
    {
        question: '"Meu filho parece ter apenas preguiça ou falta de interesse. É caso de terapia?"',
        answer: 'Na maioria das vezes, o que os adultos chamam de preguiça é apenas a ponta do iceberg. A "preguiça" mascara a profunda frustração de uma criança que tenta aprender algo de uma forma que o seu cérebro simplesmente não processa bem. Nós identificamos essa barreira neural invisível e damos as ferramentas corretas.',
        icon: <Brain size={22} />,
        color: 'bg-primary/5',
        accent: 'text-primary'
    },
    {
        question: 'Já tentamos reforço escolar e não adiantou. Qual a diferença da Psicopedagogia?',
        answer: 'O reforço escolar visa ensinar o que a criança não aprendeu na aula (foca na matéria). Nós não focamos na matéria, nós focamos na "máquina de aprender". Avaliamos habilidades como atenção, memória e funções executivas para entender onde o processo engasga.',
        icon: <Target size={22} />,
        color: 'bg-accent/5',
        accent: 'text-accent'
    },
    {
        question: 'Moramos fora do Brasil. O atendimento online funciona mesmo para crianças?',
        answer: 'Sim, e é um dos nossos diferenciais! Atendemos filhos de brasileiros expatriados em diferentes países do globo. Adaptamos os recursos lúdicos para a tela com excelência, ajudando seja na alfabetização em língua materna ou no suporte cognitivo bilingue.',
        icon: <Headphones size={22} />,
        color: 'bg-primary/5',
        accent: 'text-primary'
    },
    {
        question: 'Meu filho não gosta de médicos ou terapeutas. Como lidar com a resistência dele?',
        answer: 'Aqui a criança não vem para um "médico tirar o problema". Ela vem para brincar e ser detetive do próprio cérebro. Todo o processo é guiado por atividades lúdicas e pelos nossos companheiros Cogni e Afetina. É leve, afetivo e sem pressão de notas escolares.',
        icon: <Book size={22} />,
        color: 'bg-accent/5',
        accent: 'text-accent'
    },
    {
        question: 'O meu papel como pai/mãe fica de fora do processo?',
        answer: 'Pelo contrário. A família é nossa colunista principal. Vocês têm acesso completo ao Portal do Cliente exclusivo para ver resumos das sessões, recebem orientações práticas para aplicar em casa e temos devolutivas periódicas e transparentes.',
        icon: <Clipboard size={22} />,
        color: 'bg-primary/5',
        accent: 'text-primary'
    },
    {
        question: 'Tem prazo para terminar ou é para sempre?',
        answer: 'O objetivo final de todo o nosso acolhimento é dar "alta" e ver a criança ganhar asas sociais e cognitivas. O tratamento não é vitalício; é para gerar autonomia para sua família andar independente.',
        icon: <Lock size={22} />,
        color: 'bg-accent/5',
        accent: 'text-accent'
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 px-4 bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl text-center mb-16 sm:mb-20">
                <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] mb-4 block">Transparência</span>
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary mb-6">
                    Respostas para as suas <br />
                    principais <span className="text-accent">dúvidas.</span>
                </h2>
                <p className="text-text/60 font-body text-base sm:text-lg max-w-2xl mx-auto">
                    Ainda tem perguntas? Estamos aqui para esclarecer cada detalhe antes de começarmos.
                </p>
            </div>

            <div className="w-full max-w-3xl space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`rounded-2xl overflow-hidden transition-all duration-500 ${openIndex === index ? 'bg-background shadow-premium border border-primary/10' : 'bg-white border border-muted/10'}`}
                    >
                        <button
                            id={`faq-button-${index}`}
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-content-${index}`}
                            className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 group focus:outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl ${faq.color} ${faq.accent} flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110`}>
                                    {faq.icon}
                                </div>
                                <h3 className="font-display font-bold text-primary text-base sm:text-lg leading-tight">
                                    {faq.question}
                                </h3>
                            </div>
                            <div className={`shrink-0 text-text/20 transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-primary' : ''}`}>
                                <ChevronDown size={24} strokeWidth={2.5} />
                            </div>
                        </button>

                        <div
                            id={`faq-content-${index}`}
                            role="region"
                            aria-labelledby={`faq-button-${index}`}
                            className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="px-8 pb-8 pt-0 sm:pl-24">
                                <p className="text-text/60 text-sm sm:text-base leading-relaxed font-body">
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
