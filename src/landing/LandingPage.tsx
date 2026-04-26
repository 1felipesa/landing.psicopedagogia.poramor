import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Header from './components/Header';
import SEO from './components/SEO';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import About from './components/About';
import Services from './components/Services';
import ClientArea from './components/ClientArea';
import Methodology from './components/Methodology';
import EbooksSection from './components/EbooksSection';
import YouTubeSection from './components/YouTubeSection';
import CTA from './components/CTA';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Handle initial scroll position and expose lenis instance
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  useEffect(() => {
    // Handle scroll if redirected from another page with a hash
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        const lenis = (window as any).lenis;
        if (element && lenis) {
          lenis.scrollTo(element, { offset: -100, duration: 1.5 });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary overflow-x-hidden font-body">
      <SEO 
        title="Transformando dificuldades em potenciais de aprendizagem"
        description="Atendimento psicopedagógico especializado em Ribeirão Preto e Online. Foco em neuropsicopedagogia, dificuldades de aprendizagem e autonomia escolar com afeto e ciência."
      />
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Methodology />
        <Services />
        <About />
        <ClientArea />
        <EbooksSection />
        <YouTubeSection />
        <CTA />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;
