import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Blog from '@/components/Blog';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Hobbies from '@/components/Hobbies';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {

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



  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Blog />
        <Projects />
        <Skills />
        <Hobbies />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;