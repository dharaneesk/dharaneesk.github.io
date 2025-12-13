import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  icon: string;
  strat?: 'dark' | 'light';
}

interface SkillCategoryProps {
  title: string;
  skills: Skill[];
  delay?: number;
}

export default function SkillCategory({ title, skills, delay = 0 }: SkillCategoryProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-4 md:p-6 animate-on-scroll card-hover",
        "transition-all duration-500 transform w-full"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-center">{title}</h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2 md:p-3 rounded-lg hover:bg-foreground/5 transition-colors"
          >
            <div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center mb-1 md:mb-2">
              <img
                src={skill.icon}
                alt={skill.name}
                className={cn(
                  "w-5 h-5 md:w-7 md:h-7 object-contain",
                  skill.strat === 'dark' && "dark:invert"
                )}
              />
            </div>
            <span className="text-[10px] md:text-xs text-center leading-tight">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}