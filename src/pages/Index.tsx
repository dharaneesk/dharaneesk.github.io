import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Hobbies from '@/components/Hobbies';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AnalyticsSection from '@/pages/Analytics';

const Index = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    // Initialize intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  // Check if there's an analytics hash in the URL on mount
  useEffect(() => {
    if (window.location.hash === '#analytics') {
      setShowAnalytics(true);
    }
  }, []);

  // Update URL when analytics is shown/hidden
  useEffect(() => {
    if (showAnalytics) {
      window.history.pushState(null, '', '#analytics');
    } else {
      if (window.location.hash === '#analytics') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  }, [showAnalytics]);

  return (
    <div className="min-h-screen">
      {showAnalytics ? (
        <AnalyticsSection onClose={() => setShowAnalytics(false)} />
      ) : (
        <>
          <Navbar onShowAnalytics={() => setShowAnalytics(true)} />
          <main>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Hobbies />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;