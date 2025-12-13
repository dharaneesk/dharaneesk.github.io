import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { scrollToSection } from '@/lib/scrollToSection';


export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Hello!";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".hero-animate");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Terminal typing animation effect
  // Terminal typing animation effect (StrictMode-safe)
useEffect(() => {
  const indexRef = { current: 0 };
  const deletingRef = { current: false };
  const timeoutRef = { current: 0 as number | undefined };
  const aliveRef = { current: true };

  const typingSpeed = 200;          // ms per tick while typing
  const deletingSpeed = 200;        // ms per tick while deleting
  const pauseBeforeDelete = 1500;   // ms pause when full word is typed
  const pauseBeforeRestart = 800;   // ms pause after deleting

  function schedule(nextIn: number) {
    if (!aliveRef.current) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(tick, nextIn);
  }

  function tick() {
    if (!aliveRef.current) return;

    const i = indexRef.current;
    const isDeleting = deletingRef.current;

    // Update the text for this frame
    setDisplayText(fullText.substring(0, i));

    if (!isDeleting) {
      // typing forward
      if (i < fullText.length) {
        indexRef.current = i + 1;
        schedule(typingSpeed);
      } else {
        // at full length -> pause then start deleting
        deletingRef.current = true;
        schedule(pauseBeforeDelete);
      }
    } else {
      // deleting backward
      if (i > 0) {
        indexRef.current = i - 1;
        schedule(deletingSpeed);
      } else {
        // fully deleted -> pause then start typing again
        deletingRef.current = false;
        schedule(pauseBeforeRestart);
      }
    }
  }

  // kick things off
  schedule(500);

  // blinking cursor
  const cursorInterval = window.setInterval(() => {
    setShowCursor((prev) => !prev);
  }, 530);

  return () => {
    // kill everything cleanly (handles StrictMode double mount)
    aliveRef.current = false;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    window.clearInterval(cursorInterval);
  };
}, []); // keep this empty so it initializes once per mount


  const socialLinks = [
    {
      name: "GitHub",
      icon: "/icons/github.svg",
      url: "https://github.com/dharaneesk",
    },
    {
      name: "Leetcode",
      icon: "/icons/leetcode.svg",
      url: "https://leetcode.com/u/skdharaneeshwar/",
    },
    {
      name: "LinkedIn",
      icon:"/icons/linkedin.svg",
      url: "https://www.linkedin.com/in/dharaneeshwarsk/",
    },
  ];

  return (
    <section id="home" className="section min-h-screen flex items-center">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-1 md:order-2 flex justify-center hero-animate opacity-0">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
            <div className="w-80 h-80 md:w-96 md:h-96 relative z-10">
              <img
                src="/images/profile.jpg"
                alt="Dharaneeshwar"
                className="w-full h-full object-cover customShadow"
              />
            </div>
          </div>
        </div>
        <div className="order-2 md:order-1 hero-animate opacity-0">
          <div className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight">
            <h1 className="relative font-mono">
              <span className="terminal-text">{displayText}</span>
              <span className={`terminal-cursor ${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
            </h1>
          </div>

           {/* Open to Work Label */}
 <div className="flex items-center gap-3 mb-4">
      <button
        onClick={() => scrollToSection('contact')}
        className="
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
          bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm
          dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/60
        "
      >
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/30" />
        Open for Full Time Roles from Feb 2026
      </button>
    </div>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl leading-relaxed">
            I am{" "}
            <span className="text-primary font-semibold">
              Dharaneeshwar Shrisai Kumaraguru
            </span>
            , a Software Engineer with 3+ years of industry experience and a graduate student in Computer Science at the University at Buffalo, SUNY. My expertise lies in backend development, microservices, and cloud-native systems, with a growing focus on Artificial Intelligence and Large Language Models (LLMs)
          </p>

          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-foreground/5 hover:bg-primary hover:text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label={link.name}
              >
                <img src={link.icon} alt={link.name} className="filter dark:invert" />
              </a>
            ))}

            <a
              target="_blank"
              href="https://drive.google.com/file/d/14PKS1EwFq3jlaFvGMqZw9c9zWGAR_XRK/view?usp=sharing"
              download
              className="ml-2 flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}