import { useEffect } from 'react';
import SkillCategory from './SkillCategory';

// Add type definition to match what SkillCategory expects
type Skill = {
  name: string;
  icon: string;
  strat?: "dark" | "light";
};

export default function Skills() {
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

  const skills: {
    languages: Skill[];
    frameworks: Skill[];
    cloud: Skill[];
    ml: Skill[];
  } = {
    languages: [
      { name: 'Python', icon: 'https://cdn.worldvectorlogo.com/logos/python-5.svg' },
      { name: 'Java', icon: 'https://cdn.worldvectorlogo.com/logos/java-4.svg' },
      { name: 'JavaScript', icon: 'https://cdn.worldvectorlogo.com/logos/javascript-1.svg' },
      { name: 'Go', icon: 'https://cdn.simpleicons.org/go' },
      { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript' },
      { name: 'C++', icon: 'https://cdn.worldvectorlogo.com/logos/c.svg' },
      { name: 'SQL', icon: 'https://cdn.simpleicons.org/mysql' },
    ],
    frameworks: [
      { name: 'Spring Boot', icon: 'https://cdn.worldvectorlogo.com/logos/spring-3.svg' },
      { name: 'AngularJS', icon: 'https://cdn.worldvectorlogo.com/logos/angular-icon-1.svg' },
      { name: 'React', icon: 'https://cdn.worldvectorlogo.com/logos/react-2.svg' },
      { name: 'NodeJS', icon: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg' },
      { name: 'gRPC', icon: 'https://cdn.simpleicons.org/google' },
      { name: 'GraphQL', icon: 'https://cdn.simpleicons.org/graphql' },
      { name: 'Kafka', icon: 'https://cdn.simpleicons.org/apachekafka', strat: 'dark' },
      { name: 'RabbitMQ', icon: 'https://cdn.simpleicons.org/rabbitmq' },
    ],
    cloud: [
      { name: 'AWS', icon: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg', strat: 'dark' },
      { name: 'Openshift', icon: 'https://cdn.worldvectorlogo.com/logos/openshift.svg' },
      { name: 'Docker', icon: 'https://cdn.worldvectorlogo.com/logos/docker-4.svg' },
      { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes' },
      { name: 'Jenkins', icon: 'https://cdn.worldvectorlogo.com/logos/jenkins-1.svg' },
      { name: 'Helm', icon: 'https://cdn.simpleicons.org/helm', strat: 'dark' },
      { name: 'ArgoCD', icon: 'https://cdn.simpleicons.org/argo' },
      { name: 'Terraform', icon: 'https://cdn.simpleicons.org/terraform' },
    ],
    ml: [
      { name: 'PyTorch', icon: 'https://cdn.worldvectorlogo.com/logos/pytorch-2.svg', strat: 'dark' },
      { name: 'LangChain', icon: 'https://cdn.simpleicons.org/langchain', strat: 'dark' },
      { name: 'LangGraph', icon: 'https://cdn.simpleicons.org/langgraph', strat: 'dark' },
      { name: 'CrewAI', icon: 'https://cdn.simpleicons.org/crewai', strat: 'dark' },
      { name: 'Ray Serve', icon: 'https://cdn.simpleicons.org/ray' },
      { name: 'BentoML', icon: 'https://cdn.simpleicons.org/bentoml', strat: 'dark' },
    ],
  };

  return (
    <section id="skills" className="section">
      <div className="container mx-auto px-4">
        <div className="mb-12 md:mb-16 animate-on-scroll">
          <h2 className="section-heading">Skills</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <SkillCategory title="Languages" skills={skills.languages} delay={100} />
          <SkillCategory title="Frameworks" skills={skills.frameworks} delay={200} />
          <SkillCategory title="Cloud & Infra" skills={skills.cloud} delay={300} />
          <SkillCategory title="ML / AI" skills={skills.ml} delay={400} />
        </div>
      </div>
    </section>
  );
}