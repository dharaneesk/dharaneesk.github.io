import { useEffect, useState } from 'react';
import { Compass, PenTool, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import HobbyCarousel from './HobbyCarousel';

// Define the Slide type to match what HobbyCarousel expects
interface Slide {
  image?: string;
  gifSrc?: string; 
  title: string;
  description: string;
  fitVertical?: boolean; // Add property for vertical fitting
  youtubeEmbed?: string; // Add YouTube embed URL
}

export default function Hobbies() {
  const [activeHobby, setActiveHobby] = useState<string>('photography');
  
  useEffect(() => {
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

  const hobbies = {
    photography: {
      title: 'Graphic Design',
      icon: <PenTool className="w-5 h-5" />,
      description: 'Graphic design captivates me as a restorative hobby, offering a balance between creativity and structure. Engaging with visual elements allows me to disconnect from daily noise and channel focus into thoughtful expression. It’s a refined outlet where imagination and clarity converge.',
      socialLink: {
        url: 'https://www.behance.net/dharaneeshwarsk',
        platform: 'behance'
      },
      slides: [
        
        { 
          image: 'images/design/tshirt.jpg',
          title: 'T-Shirt Design',
          description: 'As the official Design Head of Pragyan 21 created T shirt designs for the fest'
        },
        { 
          image: 'images/design/sports.png',
          title: 'Posters of my Favs!',
          // description: 'As the official Design Head of Pragyan 21 created UI assests and wireframes'
        },
        {
          gifSrc: '/images/design/ntd.gif',
          title: 'Motion Poster for No Tobacco Day',
          description: 'Glitch-style animated type experiment',
        },
        { 
          image: 'images/design/website.png',
          title: 'Pragyan 21 Website UI',
          description: 'As the official Design Head of Pragyan 21 created UI assests and wireframes'
        },
        { 
          image: 'images/design/wallpapers.png',
          title: 'Wallpapers',
          // description: 'As the official Design Head of Pragyan 21 created UI assests and wireframes'
        },
        { 
          image: 'images/design/broc.png',
          title: 'Placement Brochure Design for NIT Trichy',
          description: 'Tasked with designing the placement brochure as part of the Graphique'
        },
        { 
          image: 'images/design/logo.png',
          title: 'Logo Design for Prodigy',
          description: 'As the official Design Head of Prodigy 20'
        },
        { 
          image: 'images/design/inv.png',
          title: 'Invitation Design',
          description: 'Invitation card design for NITT Convocation 2020'
        },
        { 
          image: 'images/design/36.png',
          title: 'Typeface Design',
          // description: 'As the official Design Head of Pragyan 21 created UI assests and wireframes'
        },
        { 
          image: 'images/design/5DTG.jpg',
          title: '5 Days to Go',
          description: 'Artwork done for Festember 19 around the theme cinema paradiso'
        },
        { 
          image: 'images/design/others.png',
          title: 'Other works',
          // description: 'Artwork done for Festember 19 around the theme cinema paradiso'
        },
      ],
    },
    painting: {
      title: 'Travel',
      icon: <Compass className="w-5 h-5" />,
      description: 'Travel inspires me as a way to break routine, explore new perspectives, and reconnect with the world beyond screens. It fuels my curiosity, challenges my comfort zones, and brings a sense of renewal through every journey.',
      socialLink: {
        url: 'https://www.instagram.com/dharaneeeee/',
        platform: 'instagram'
      },
      fitVertical: true,
      slides: [
        { 
          image: 'images/trips/cali.jpeg',
          title: 'West Coast, Dec 2024',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/dand.jpeg',
          title: 'Shivamogga, Jul 2024',
          description: '',
          // fitVertical: true
        },
       
        { 
          image: 'images/trips/manali.jpeg',
          title: 'Manali, May 2024',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/leh.jpeg',
          title: 'Leh, Apr 2024',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/nagalapuram.jpeg',
          title: 'Nagalapuram, Feb 2024',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/srilanka.jpeg',
          title: 'Srilanka, Jul 2023',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/car.jpeg',
          title: 'South India, May 2023',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/pondy.jpeg',
          title: 'Pondy, Mar 2023',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/goa.jpeg',
          title: 'Goa, Dec 2022',
          description: '',
          // fitVertical: true
        },
        { 
          image: 'images/trips/vagamon.jpeg',
          title: 'Vagamon, Dec 2022',
          description: '',
          // fitVertical: true
        },
        // { 
        //   image: 'images/trips/varkala.jpeg',
        //   title: 'Varkala, Dec 2022',
        //   description: '',
        //   // fitVertical: true
        // },
        { 
          image: 'images/trips/yercuad.jpeg',
          title: 'Yercaud, Feb 2021',
          description: '',
          // fitVertical: true
        },
      ],
    },
    animation: {
      title: 'Cinematography',
      icon: <Video className="w-5 h-5" />,
      description: 'Cinematography captivate me as powerful medium for storytelling and self-expression. Through composition, lighting, and motion, I can convey emotions and ideas that words often fall short of capturing. Each frame becomes a canvas, allowing me to craft immersive visual narratives that connect with others on a deeper, more human level.',
      socialLink: {
        url: 'https://www.youtube.com/channel/UCfDR-EmpGUbhMIeOsC043uQ',
        platform: 'youtube'
      },
      slides: [
        { 
          youtubeEmbed: 'https://www.youtube.com/embed/RmBZBHtmxZk?si=5j4hO1C8CcRss4dK',
          title: '',
          description: ''
        },
      ],
    },
  };

  return (
    <section id="hobbies" className="section">
      <div className="container mx-auto">
        <div className="mb-16 animate-on-scroll text-center">
          <h2 className="section-heading">Hobbies !</h2>
        </div>
        
        <div className="flex justify-center mb-6 sm:mb-10 animate-on-scroll">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl px-4">
            {(Object.keys(hobbies)).map((hobby) => (
              <button
                key={hobby}
                onClick={() => setActiveHobby(hobby)}
                className={cn(
                  "glass-panel py-3 px-2 sm:py-4 sm:px-6 rounded-xl flex flex-col items-center gap-1 sm:gap-2 transition-all duration-300",
                  activeHobby === hobby 
                    ? "bg-primary/10 border-primary/50" 
                    : "hover:bg-foreground/5"
                )}
              >
                <div 
                  className={cn(
                    "p-1.5 sm:p-2 rounded-full",
                    activeHobby === hobby ? "text-primary" : "text-foreground/70"
                  )}
                >
                  {hobbies[hobby].icon}
                </div>
                <span className={cn(
                  "text-[10px] sm:text-sm font-medium text-center",
                  activeHobby === hobby ? "text-primary" : "text-foreground/70"
                )}>
                  {hobbies[hobby].title}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 animate-on-scroll">
          {/* Pass the hobby key to maintain independent slide states */}
          <HobbyCarousel 
            slides={hobbies[activeHobby].slides}
            fitVertical={hobbies[activeHobby]?.fitVertical}
            hobbyKey={activeHobby} // This is the key fix - passing a unique key for each hobby
          />
          
          {/* Text section with social link button - modified for mobile responsiveness */}
          <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/20 animate-on-scroll">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-medium mb-2">{hobbies[activeHobby].title}</h3>
              <p className="text-foreground/80 mb-6">{hobbies[activeHobby].description}</p>
              <a 
                href={hobbies[activeHobby].socialLink.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors mt-4 md:mt-0 w-full md:w-auto max-w-xs"
              >
                {hobbies[activeHobby].socialLink.platform === 'instagram' ? (
                  <>
                    <img src="icons/instagram.svg" alt="instagram" className="blueFilter mr-2 w-5 h-5" />
                    <span>Follow on Instagram</span>
                  </>
                ) : hobbies[activeHobby].socialLink.platform === 'behance' ? (
                  <>
                    <img src="https://cdn.worldvectorlogo.com/logos/behance.svg" alt="behance" className="blueFilter mr-2 w-5 h-5" />
                    <span>Follow on Behance</span>
                  </>
                ) : (
                  <>
                    <img src="https://cdn.worldvectorlogo.com/logos/youtube-icon-5.svg" alt="youtube" className="blueFilter mr-2 w-5 h-5" />
                    <span>Watch on YouTube</span>
                  </>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}