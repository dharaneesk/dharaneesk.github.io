
import { useEffect } from 'react';
import ContactForm from './ContactForm';
import { initScrollAnimations } from '@/utils/scrollAnimations';

export default function Contact() {
  useEffect(() => {
    return initScrollAnimations();
  }, []);

  const socialLinks = [
    { name: 'GitHub', icon: "icons/github.svg", url: 'https://github.com/dharaneesk', text: 'GitHub' },
    { name: 'Instagram', icon: "icons/instagram.svg", url: 'https://www.instagram.com/dharaneeeee/', text: 'Instagram' },
    { name: 'LinkedIn', icon: "icons/linkedin.svg", url: 'https://www.linkedin.com/in/dharaneeshwarsk/', text: 'LinkedIn' },
    { name: 'Email', icon: 'icons/mail.png', url: 'mailto:skdharaneeshwar@gmail.com', text: 'skdharaneeshwar@gmail.com' },
    { name: 'Phone', icon: "icons/phone.png", url: 'tel:+17165204707', text: '+1-716-520-4707' },
  ];

  return (
    <section id="contact" className="section">
      <div className="container mx-auto">
        <div className="mb-16 animate-on-scroll">
          <h2 className="section-heading">Contact Me</h2>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto">
            Feel free to reach out through any of the following channels:
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div className="animate-on-scroll">
            <div className="glass-panel rounded-xl p-6 h-full bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition-colors group"
                  >
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <img src={link.icon} alt={link.name} className="filter dark:invert contactIcons" />
                    </div>
                    <span className="text-sm md:text-base truncate">{link.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="animate-on-scroll">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
