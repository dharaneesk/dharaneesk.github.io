import { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';

import './styles.css';

interface Technology {
  name: string;
  icon: string;
  strat?: "dark" | "light";
}

interface Project {
  title: string;
  description: string;
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  devpostUrl?: string;
  technologies: Technology[];
  isHackathonWinner?: boolean;
  categories: ProjectCategory[];
}

type ProjectCategory = 'All' | 'AI/Machine Learning' | 'Fullstack' | 'Cloud' | 'Gen AI/LLMs';

export default function Projects() {

  const allProjects: Project[] = [
    {
      title: 'AI Summarization Pipeline',
      description: 'Built an end-to-end AI summarization system combining extractive, abstractive, and rewriting models to generate high-quality legal and news summaries, deployed via FastAPI for real-time inference.',
      image: 'images/project/summarization.png',
      technologies: [
        { name: 'Pytorch', icon: 'https://cdn.worldvectorlogo.com/logos/pytorch-2.svg', strat: 'dark' },
        { name: 'Hugging Face', icon: 'https://huggingface.co/front/assets/huggingface_logo.svg' },
        { name: 'FastAPI', icon: 'https://cdn.worldvectorlogo.com/logos/fastapi.svg' },
      ],
      categories: ['AI/Machine Learning', 'Gen AI/LLMs'],
    },
    {
      title: 'Capsule Networks on CIFAR-10',
      description: 'Implemented Capsule Networks with dynamic routing and reconstruction loss, achieving 96% accuracy while building a fully reproducible deep learning training pipeline.',
      image: 'images/project/capsnet.jpg',
      technologies: [
        { name: 'Pytorch', icon: 'https://cdn.worldvectorlogo.com/logos/pytorch-2.svg', strat: 'dark' },
        { name: 'Deep Learning', icon: 'https://cdn.worldvectorlogo.com/logos/python-5.svg' },
      ],
      categories: ['AI/Machine Learning'],
    },
    {
      title: 'Automation of Visual Inspection',
      description: 'Developed a real-time image classification system for manufacturing defect detection, reducing manual inspection effort through automated crack and pinhole identification.',
      image: 'images/project/inspection.jpg',
      technologies: [
        { name: 'Python', icon: 'https://cdn.worldvectorlogo.com/logos/python-5.svg' },
        { name: 'OpenCV', icon: 'icons/opencv.png' }
      ],
      categories: ['AI/Machine Learning'],
    },
    {
      title: 'Sentiment LSTM',
      description: 'Implemented sentiment classification using LSTM and BiLSTM models on the IMDB dataset with strong accuracy, interpretability, and evaluation metrics.',
      image: 'images/project/sentiment.webp',
      technologies: [
        { name: 'Pytorch', icon: 'https://cdn.worldvectorlogo.com/logos/pytorch-2.svg', strat: 'dark' },
        { name: 'LSTM', icon: 'https://cdn.worldvectorlogo.com/logos/python-5.svg' },
      ],
      categories: ['AI/Machine Learning'],
    },
    {
      title: 'TimeSeries LSTM',
      description: 'Built RNN and LSTM models from scratch for time-series forecasting, demonstrating superior performance of LSTMs on temporal prediction tasks.',
      image: 'images/project/timeseries.png',
      technologies: [
        { name: 'Pytorch', icon: 'https://cdn.worldvectorlogo.com/logos/pytorch-2.svg', strat: 'dark' },
        { name: 'Time Series', icon: 'https://cdn.worldvectorlogo.com/logos/python-5.svg' },
      ],
      categories: ['AI/Machine Learning'],
    },
    {
      title: 'DeepGrad',
      description: 'Analyzed vanishing gradient issues by comparing deep CNN architectures, highlighting the impact of residual connections on training stability and performance.',
      image: 'images/project/deepgrad.png',
      technologies: [
        { name: 'CNNs', icon: 'https://cdn.worldvectorlogo.com/logos/tensorflow-2.svg' },
        { name: 'Pytorch', icon: 'https://cdn.worldvectorlogo.com/logos/pytorch-2.svg', strat: 'dark' },
      ],
      categories: ['AI/Machine Learning'],
    },
    {
      title: 'Vision Net',
      description: 'Implemented and compared VGG-16 and ResNet-18 architectures from scratch, evaluating convergence behavior and generalization across image classification tasks.',
      image: 'images/project/visionnet.png',
      technologies: [
        { name: 'CNNs', icon: 'https://cdn.worldvectorlogo.com/logos/tensorflow-2.svg' },
        { name: 'ResNet', icon: 'https://cdn.worldvectorlogo.com/logos/pytorch-2.svg', strat: 'dark' },
      ],
      categories: ['AI/Machine Learning'],
    },
    {
      title: 'Discord Automation Bot',
      description: 'Built an automation bot to streamline digital asset downloads and cloud storage, significantly reducing manual effort through scalable automation.',
      image: 'images/project/discord.avif',
      technologies: [
        { name: 'Node.js', icon: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg' },
        { name: 'Docker', icon: 'https://cdn.worldvectorlogo.com/logos/docker.svg' },
        { name: 'AWS', icon: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg', strat: 'dark' },
      ],
      categories: ['Fullstack', 'Cloud'],
    },
  ];



  const tabs: ProjectCategory[] = ['All', 'AI/Machine Learning', 'Fullstack', 'Cloud', 'Gen AI/LLMs'];

  const [activeTab, setActiveTab] = useState<ProjectCategory>('All');
  const [currentProjects, setCurrentProjects] = useState<Project[]>(allProjects);

  const getProjectsForTab = (tab: ProjectCategory): Project[] => {
    if (tab === 'All') {
      return allProjects;
    }
    return allProjects.filter(project => project.categories.includes(tab));
  };

  useEffect(() => {
    const proj = getProjectsForTab(activeTab);
    setCurrentProjects(proj);
  }, [activeTab]);

  return (
    <section id="projects" className="section">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="section-heading">My Projects</h2>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-5 py-3 text-sm font-medium transition-all duration-200 ease-in-out
                  ${activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400 -mb-px'
                    : 'text-gray-400 hover:text-blue-300 dark:hover:text-white'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentProjects.length > 0 ? (
            currentProjects.map((project, index) => (
              <ProjectCard
                key={`${project.title}-${index}-${activeTab}`}
                title={project.title}
                description={project.description}
                image={project.image}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
                devpostUrl={project.devpostUrl}
                technologies={project.technologies}
                reversed={index % 2 !== 0}
                isHackathonWinner={project.isHackathonWinner}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}