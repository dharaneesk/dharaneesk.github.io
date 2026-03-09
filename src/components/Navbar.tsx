import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Hobbies', href: '#hobbies' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const bodyRef = useRef(document.body);

  // Handle scroll locking when menu is open
  useEffect(() => {
    const body = bodyRef.current;

    if (isMenuOpen) {
      // Lock scroll when menu is open
      body.style.overflow = 'hidden';
    } else {
      // Restore scroll when menu is closed
      body.style.overflow = '';
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });

      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'py-2 glass-panel' : 'py-4 bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-mono font-bold tracking-tighter">
            <span className="text-gradient">{'{ '}</span>
            Dharaneeshwar
            <span className="text-gradient">{' }'}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn("nav-link", activeSection === link.href.slice(1) && "active")}
                onClick={(e) => {
                  e.preventDefault();
                  const href = link.href.slice(1);
                  const element = document.getElementById(href);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 80,
                      behavior: 'smooth',
                    });
                  }
                }}
              >
                {link.name}
              </a>
            ))}



            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full hover:bg-background/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="mr-4 p-2 rounded-full hover:bg-background/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-background/80 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Menu - Completely separate from header to ensure full coverage */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden" style={{ backgroundColor: theme === 'dark' ? '#0B0F19' : '#FFFFFF' }}>
          <div className="h-full flex flex-col">
            <div className="p-4 flex justify-end">
              <button
                onClick={closeMenu}
                className="p-2 rounded-md hover:bg-background/20 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-xl py-2 px-4 rounded-md transition-colors",
                    activeSection === link.href.slice(1)
                      ? "text-blue-500 font-medium"
                      : theme === 'dark' ? "text-gray-300" : "text-gray-700"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    const href = link.href.slice(1);
                    const element = document.getElementById(href);
                    if (element) {
                      closeMenu();
                      setTimeout(() => {
                        window.scrollTo({
                          top: element.offsetTop - 80,
                          behavior: 'smooth',
                        });
                      }, 100);
                    }
                  }}
                >
                  {link.name}
                </a>
              ))}


            </div>
          </div>
        </div>
      )}
    </>
  );
}