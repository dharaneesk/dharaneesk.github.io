import { Github, Globe, ArrowUpRight, ExternalLink, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

interface Technology {
  name: string;
  icon: string;
  strat?: "dark" | "light";  // Added strat property
}

type ProjectCategory = 'All' | 'AI/Machine Learning' | 'Fullstack' | 'Cloud' | 'Gen AI/LLMs';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  devpostUrl?: string;
  technologies: Technology[];
  reversed?: boolean;
  isHackathonWinner?: boolean;
}

export default function ProjectCard({
  title,
  description,
  image,
  githubUrl,
  liveUrl,
  devpostUrl,
  technologies,
  reversed = false,
  isHackathonWinner = false,
}: ProjectCardProps) {
  // Get the current theme from context
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  
  // Determine which URL to use for the image link (prioritize GitHub over Live Demo)
  const imageClickUrl = githubUrl || liveUrl;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border-none bg-gradient-to-br from-background/30 to-background/10",
        "backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500",
        "h-full flex flex-col relative" // Make card take full height and add relative positioning
      )}
    >
      {isHackathonWinner && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-sm font-medium shadow-lg">
          <Star size={14} className="fill-current" />
          <span>Hackathon Winner</span>
        </div>
      )}
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex flex-col p-6 h-full">
          {/* Title section - fixed height */}
          <div className="min-h-[3rem] mb-2 flex items-center">              
            <h3 className="text-xl sm:text-2xl font-bold group flex items-center gap-2">
              {title}
              <span className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-[0px] transition-all duration-300">
                <ArrowUpRight size={16} />
              </span>
            </h3>
          </div>
            
          {/* Description section - fixed height */}
          <div className="min-h-[5rem] mb-4">
            <p className="text-sm sm:text-base text-foreground/70 line-clamp-3 sm:line-clamp-none">{description}</p>
          </div>
            
          {/* Technology icons section - fixed height */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 min-h-[5rem] sm:min-h-[6rem]">
            {technologies.map((tech, index) => (
              <div key={index} className="flex flex-col items-center gap-1 transition-transform hover:scale-110 duration-300">
                <div className="p-1.5 sm:p-2 rounded-md bg-background/50 shadow-sm">
                  <img 
                    src={tech.icon} 
                    alt={tech.name} 
                    className={cn(
                      "w-5 h-5 sm:w-6 sm:h-6",
                      // Only apply invert filter to dark icons when in dark mode
                      tech.strat === "dark" && isDarkMode && "filter invert"
                    )} 
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-foreground/70">{tech.name}</span>
              </div>
            ))}
          </div>
          
          {/* Project Thumbnail - fixed aspect ratio */}
          <div className={cn(
            "overflow-hidden rounded-lg aspect-video group mb-6",
            "transition-all duration-500 shadow-md hover:shadow-xl",
            "bg-gradient-to-br from-background/30 to-background/10 p-1",
            imageClickUrl ? "cursor-pointer" : ""
          )}>
            {imageClickUrl ? (
              <a 
                href={imageClickUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative w-full h-full overflow-hidden rounded-lg"
              >
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
          </div>
          
          {/* Buttons section - fixed height */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-auto">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-full text-xs sm:text-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
              >
                <Github size={14} className="sm:size-4" />
                <span>View Code</span>
              </a>
            )}
            
            {devpostUrl && (
              <a
                href={devpostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-full text-xs sm:text-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
              >
                <ExternalLink size={14} className="sm:size-4" />
                <span>Devpost</span>
              </a>
            )}
            
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs sm:text-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/20 group"
              >
                <Globe size={14} className="sm:size-4 transition-transform group-hover:rotate-12 duration-300" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}