import { useEffect } from 'react';
import { Briefcase, GraduationCap, Calendar, Award } from 'lucide-react';
import TimelineEvent from './TimelineEvent';

export default function About() {
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

  const workExperience = [
  
    {
      title: 'Digital S/W Engineer Analyst (SDE II)',
      company: 'Citi',
      date: 'Aug 2022 - Aug 2024',
      description: 'Developed and deployed a production-grade, explainable credit risk scoring system using machine learning, consolidating dozens of legacy models into a single standardized solution and improving decision transparency. Improved approval outcomes by generating interpretable risk scores and adverse-action insights, reducing dependency on external data providers. Designed high-concurrency backend services to orchestrate hundreds of parallel loan-processing calls, significantly improving throughput and reliability across multiple business lines. Built and optimized RESTful APIs and customer-facing applications used by millions of users, accelerating large-scale credit and lending workflows. Modernized legacy platforms by migrating to containerized, service-oriented architectures, improving performance, scalability, and cost efficiency. Supported end-to-end delivery of high-volume financial platforms processing millions of applications annually, while enabling cloud migration, secure deployments, automated testing, and reliable production releases through close cross-functional collaboration.',
      icon: <img src="icons/citi.png" alt={"Citi Icon"} className="filter aboutIcons" />,
      technologies: ['Java', 'Spring Boot', 'Machine Learning', 'REST APIs', 'Microservices', 'Jenkins'],
      button: {
        text: 'View Employer',
        link: 'https://www.citi.com/personal-loans?affcode=CLN&intc=pil_borrow_globalnav_prelogin'
      }
    },
    {
      title: 'Tech Program Analyst (SDE I)',
      company: 'Citi',
      date: 'July 2021 - Aug 2022',
      description: 'Contributed to building and enhancing backend services and user-facing applications supporting large-scale credit and lending workflows. Assisted in migrating application functionality away from legacy systems toward service-based integrations, improving maintainability and performance. Implemented and optimized RESTful APIs used by high-volume customer journeys, and helped reduce processing latency by parallelizing external data integrations. Supported environment setup, secure configurations, and deployment activities across development and testing stages. Collaborated closely with developers, testers, and DevOps teams to close defects, support sprint deliveries, and ensure release readiness through agile practices and automated testing.',
      icon: <img src="icons/citi.png" alt={"Citi Icon"} className="filter aboutIcons" />,
      technologies: ['Java', 'Spring Boot', 'REST APIs', 'JUnit', 'JavaScript'],
      button: {
        text: 'View Employer',
        link: 'https://www.citi.com/personal-loans?affcode=CLN&intc=pil_borrow_globalnav_prelogin'
      }
    },
    {
      title: 'Machine Learning Intern',
      company: 'Vevolve Software Pvt. Ltd.',
      date: 'May 2020 - Aug 2020',
      description: 'Worked in a research and development lab to build machine learning models for automated vulnerability detection in web applications. Developed and evaluated classifiers such as Support Vector Machines and Decision Trees to identify security risks including SQL injection and cross-site scripting from processed vulnerability datasets. Labeled and structured large-scale assessment data into feature-rich datasets to improve model accuracy and reliability. Contributed to strengthening security posture for enterprise clients by reducing exploitable risks through data-driven threat detection and analysis.',
      icon: <img src="icons/vevolve.jpeg" alt={"Vevolve Icon"} className="filter aboutIcons" />,
      technologies: ['Python', 'Scikit-learn', 'Machine Learning', 'Cybersecurity', 'Model Evaluation']
    },
    {
      title: 'Android App Dev Intern',
      company: 'Interlace India',
      date: 'May 2019 - Jul 2019',
      description: 'Developed an Android application to streamline and manage the employee hiring process, including candidate tracking, interview scheduling, and status management. Designed intuitive user interfaces and implemented core business logic to improve usability and operational efficiency. Worked closely with stakeholders to understand hiring workflows and translate requirements into functional mobile features. Gained hands-on experience with end-to-end mobile application development, testing, and iteration while delivering a reliable solution within a short internship timeline.',
      icon: <img src="icons/interlace.jpeg" alt={"Interlace Icon"} className="filter aboutIcons" />,
      technologies: ['Android Studio', 'Java', 'Mobile App Development', 'UI/UX Design', 'SQLite']
    }
  ];

  const education = [
    {
      title: 'Master of Science',
      company: 'University at Buffalo, SUNY',
      date: 'Aug 2024 - Dec 2025',
      description: 'With a cumulative GPA of 3.88, I have demonstrated strong academic performance across key computer science disciplines, earning A grades in Deep Learning, Algorithms, Operating Systems and Machine Learning. My current focus lies at the intersection of large-scale distributed systems and machine learning, where I am actively developing new-age GenAI applications through rapid prototyping methodologies. This hands-on approach has deepened my understanding of machine learning concepts while sharpening my ability to quickly iterate and deploy innovative solutions that leverage cutting-edge AI technologies.',
      icon: <img src="icons/ub.png" alt={"UB Icon"} className="filter aboutIcons dark:invert" />,
      technologies: ['Distributed Systems', 'Deep Learning', 'Algorithms', 'Database Management', 'Gen AI'],
      button: {
        text: 'View University',
        link: 'https://www.buffalo.edu/'
      }
    },
    {
      title: 'Bachelor of Technology',
      company: 'National Institute of Technology, Trichy',
      date: 'June 2017 - May 2021',
      description: 'Completed undergraduate studies with a strong foundation in computer science fundamentals, complemented by hands-on projects and collaborative learning. Actively took on leadership roles on campus by co-founding Graphique, the official design club, and leading design and media initiatives for large national-level events such as Pragyan and Prodigy, developing strong leadership, communication, and execution skills alongside technical growth.',
      icon: <img src="icons/nitt.png" alt={"NITT Icon"} className="invert dark:invert-0 aboutIcons" />,
      technologies: ['C++', 'Python', 'Web Development', 'Data Structures',  'Workshops', 'Leadership' ],
      button: {
        text: 'View University',
        link: 'https://www.nitt.edu/'
      }
    },
  ];

  const workStudy = [
    {
      "title": "Grading Assistant CSE250",
      "company": "University at Buffalo School of Engineering and Applied Sciences",
      "date": "Jan 2025 - Dec 2025",
      "description": "Assisting Prof. Eric Mikida with evaluating assignments and providing feedback for CSE 250: Data Structures course of 180+ undergrads",
      "icon": <img src="icons/cse.png" alt={"khoury Icon"} className="filter aboutIcons " />,
      button: {
        text: 'View on LinkedIn',
        link: 'https://www.linkedin.com/school/ub-seas/'
      }
    }
  ];

  const certs = [
   
   
    {
      "title": "AWS Developer Associate",
      "company": "Amazon Web Services",
      "date": "2024",
      "icon": <img src="icons/aws.png" alt={"AWS Icon"} className="filter aboutIcons" />,
      "description": "Earned the AWS Developer Associate certification, demonstrating thorough knowledge of AWS services and cloud computing concepts.",
      "technologies": ["AWS Lambda", "AWS CloudFront", "AWS S3", "AWS EC2", "AWS API Gateway", "AWS DynamoDB", "AWS IAM", "AWS CloudWatch", "AWS CloudTrail", "AWS CloudFormation", "AWS CloudWatch", "AWS CloudTrail", "AWS CloudFormation", "AWS CloudWatch", "AWS CloudTrail", "AWS CloudFormation"],
      button: {
        text: 'View Certificate',
        link: 'https://www.credly.com/badges/7f13064d-2029-4b41-bf5a-2cb9e37a3fb5'
      }

    },
    {
      "title": "Machine Learning",
      "company": "Stanford University",
      "date": "2020",
      "icon": <img src="icons/stanford.webp" alt={"Stanford Icon"} className="filter aboutIcons" />,
      "description": "I successfully completed the Machine Learning course by Andrew Ng on Coursera, offered by Stanford University. This course provided a strong foundation in key machine learning concepts, including supervised and unsupervised learning, model evaluation, regularization, and neural networks. I also learned to implement these algorithms using MATLAB/Octave, which helped solidify my understanding of the underlying mathematical principles. Upon completion, I earned a certificate recognizing my proficiency in the fundamentals of machine learning.",
      "technologies": [
                  "Supervised Learning",
                  "Unsupervised Learning",
                  "Linear Regression",
                  "Logistic Regression",
                  "Support Vector Machines (SVM)",
                  "Neural Networks",
                  "Backpropagation",
                  "Octave/MATLAB",
                  "Gradient Descent",
                  "Regularization",
                  "K-means Clustering",
                  "Anomaly Detection",
                  "Principal Component Analysis (PCA)"],
      button: {
        text: 'View Certificate',
        link: 'https://www.coursera.org/account/accomplishments/verify/974D5VBD8SHE'
      }

    }
  ];

  const achievements = [
          {
        title: 'Citi Recognition Awards',
        company: 'Citi',
        date: '2021 – 2024',
        description: 'Recognized with 3 Citi Bronze Awards for pivotal contributions to Loans and Credit initiatives, along with 4 Citi Applause Awards for ownership and execution of key cross-team initiatives delivering measurable business impact.',
        icon: <img src="icons/citi.png" alt={"Citi Icon"} className="filter aboutIcons" />,
        technologies: ['Cross-team Collaboration', 'Product Delivery', 'Ownership', 'Engineering Excellence']
      }

  ];

  return (
    <section id="about" className="section min-h-0 h-auto w-full">
      <div className="container mx-auto py-12 px-4">
        <div className="mb-16 animate-on-scroll">
          <h2 className="section-heading">About Me</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div className="animate-on-scroll">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-primary" />
              <h3 className="text-2xl font-bold">Work Experience</h3>
            </div>
            
            <div className="relative mt-8">
              {workExperience.map((job, index) => (
                <TimelineEvent key={index} {...job} />
              ))}
            </div>

            <div className="animate-on-scroll customTopPadding">
              <div className="flex items-center gap-2 mb-6">
                <Award className="text-primary" />
                <h3 className="text-2xl font-bold">Achievements</h3>
              </div>
              
              <div className="relative mt-8">
                {achievements.map((achievement, index) => (
                  <TimelineEvent key={index} {...achievement} />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="animate-on-scroll">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="text-primary" />
                <h3 className="text-2xl font-bold">Education</h3>
              </div>
              
              <div className="relative mt-8">
                {education.map((edu, index) => (
                  <TimelineEvent key={index} {...edu} />
                ))}
              </div>
            </div>

            <div className="animate-on-scroll customTopPadding">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="text-primary" />
                <h3 className="text-2xl font-bold">Work Study</h3>
              </div>
              
              <div className="relative mt-8">
                {workStudy.map((edu, index) => (
                  <TimelineEvent key={index} {...edu} />
                ))}
              </div>


            </div>

            <div className="animate-on-scroll customTopPadding">
              <div className="flex items-center gap-2 mb-6">
                <Award className="text-primary" />
                <h3 className="text-2xl font-bold">Certifications</h3>
              </div>
              
              <div className="relative mt-8">
                {certs.map((edu, index) => (
                  <TimelineEvent key={index} {...edu} />
                ))}
              </div>


            </div>

          </div>
        </div>
      </div>
    </section>
  );
}