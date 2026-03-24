
import React from 'react';

const services = [
  {
    title: 'Diagnóstico',
    subtitle: '(O Mapa)',
    description: 'Uma investigação profunda e técnica para identificar onde a jornada travou. O mapa necessário para entender as barreiras de aprendizagem e traçar a melhor rota de superação.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finn-blue"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" /></svg>,
    color: 'bg-blue-50',
    accent: 'text-finn-blue'
  },
  {
    title: 'Intervenção',
    subtitle: '(A Jornada)',
    description: 'O momento da ação! Sessões que unem ciência e ludicidade para estimular as funções executivas, a leitura, a escrita e o prazer de descobrir o novo.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-jake-yellow"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>,
    color: 'bg-yellow-50',
    accent: 'text-jake-yellow'
  },
  {
    title: 'Atendimento Itinerante',
    subtitle: '(Suporte no Campo)',
    description: 'Flexibilidade para sua aventura. Atendimentos presenciais em salas de coworking confortáveis em Ribeirão Preto/SP ou região, também em escolas e suporte online pra atender para qualquer lugar do mundo.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grass-green"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
    color: 'bg-green-50',
    accent: 'text-grass-green'
  }
];

const Services: React.FC = () => {
  return (
    <section id="servicos" className="py-16 sm:py-24 px-4 bg-[#F0F9FF] flex flex-col items-center">
      <div className="w-full max-w-4xl text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-jake-yellow/20 text-yellow-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Nossos Serviços
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 px-4">
          Nossas <span className="text-jake-yellow underline decoration-jake-yellow/30 decoration-8 underline-offset-4">Expedições</span>
        </h2>
        <p className="text-slate-600 font-medium text-base sm:text-lg max-w-2xl mx-auto px-4">
          Escolha o equipamento certo para a jornada do aprendizado. Cada serviço é um item essencial no seu inventário de evolução.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-white rounded-[2.5rem] p-4 flex flex-col border-2 border-slate-100 shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className={`w-full aspect-[2/1] ${service.color} rounded-[2rem] flex items-center justify-center mb-4 group-hover:scale-[0.98] transition-transform overflow-hidden relative`}>
              <div className="transform group-hover:scale-110 transition-transform duration-500 z-10 scale-75 sm:scale-100">
                {service.icon}
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            </div>

            <div className="px-4 pb-4 flex-1 flex flex-col items-center text-center">
              <h3 className="text-xl font-black text-slate-900 mb-1">{service.title}</h3>
              <p className={`font-black uppercase tracking-widest text-[10px] mb-3 ${service.accent}`}>{service.subtitle}</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
