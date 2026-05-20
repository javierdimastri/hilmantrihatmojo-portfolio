'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Github, Linkedin, Mail, Terminal, Database, Layout, 
  Server, Code2, Briefcase, GraduationCap, ChevronRight 
} from 'lucide-react';

// Static data
const EXPERIENCES = [
  {
    company: 'PT Bank SMBC Indonesia',
    role: 'Fullstack Developer',
    period: '2020 - Current',
    projects: [
      {
        name: 'COS-SALEs (Video-Call-System)',
        period: '2022 - Current',
        description: 'Web Application used by Sales to verify customers easily via video call, improving credit approval by 40%.',
        tech: ['Java Spring Boot', 'NestJs', 'NextJs', 'WebSocket', 'Redis', 'Twilio']
      },
      {
        name: 'Dea-Repo',
        period: 'Project',
        description: 'Initiated and maintained Internal Application used by IT Planning Architecture to track initiatives or new applications registered in the Company.',
        tech: []
      },
      {
        name: 'Integral',
        period: '2020 - 2022',
        description: 'Maintained Talent-X Application for HR recruitment tracking and an internal app for PMO to track project status from creation to closure.',
        tech: []
      }
    ]
  },
  {
    company: 'PT Xsis Mitra Utama (Client: PT Astra International)',
    role: 'Fullstack Developer .Net',
    period: '2018 - 2020',
    projects: [
      {
        name: 'Project Operation Acceleration Team',
        period: '2018 - 2020',
        description: 'Focused on ensuring smooth project handover by fixing existing bugs and adding necessary new features prior to project closure.',
        tech: ['.NET']
      }
    ]
  }
];

const SKILL_CATEGORIES = [
  {
    title: 'Backend',
    icon: Server,
    color: 'text-green-500',
    bg: 'bg-green-50',
    skills: ['Java Spring Boot', 'NestJs', 'Express', '.NET']
  },
  {
    title: 'Frontend',
    icon: Layout,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    skills: ['NextJs', 'ReactJs']
  },
  {
    title: 'Languages',
    icon: Code2,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    skills: ['Java', 'JavaScript', 'TypeScript', 'C#']
  },
  {
    title: 'Database & Messaging',
    icon: Database,
    color: 'text-red-500',
    bg: 'bg-red-50',
    skills: ['MySQL', 'MSSQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ']
  }
];

const NAV_ITEMS = ['Home', 'Experience', 'Skills', 'Education'];
const SECTIONS = ['home', 'experience', 'skills', 'education'];

// Throttle utility
const throttle = (fn: Function, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Navigation Component
const Navigation = React.memo(({ activeSection, onNavigate, isScrolled }: any) => (
  <nav className={`fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
  }`}>
    <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
      <div className="font-mono font-bold text-xl text-gray-900 tracking-tighter">
        <span className="text-blue-600">{'<'}</span>
        DevPortfolio
        <span className="text-blue-600">{' />'}</span>
      </div>
      <div className="hidden md:flex space-x-8">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item.toLowerCase())}
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              activeSection === item.toLowerCase() ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  </nav>
));

// Hero Section Component
const HeroSection = React.memo(({ onNavigate }: any) => (
  <section id="home" className="min-h-screen flex items-center pt-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="max-w-3xl">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-6 text-sm font-medium">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </div>
          <span>Available for new opportunities</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Fullstack Developer.
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
          I specialize in building robust, scalable applications from the database to the user interface. 
          Passionate about clean code, modern architecture, and delivering impactful solutions.
        </p>
        
        <div className="flex flex-wrap items-center gap-6">
          <button 
            onClick={() => onNavigate('experience')}
            className="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            View Experience
            <ChevronRight size={20} />
          </button>
          <div className="flex space-x-6 px-6">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#0077b5] transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
));

// Experience Section Component
const ExperienceSection = React.memo(() => (
  <section id="experience" className="py-24 bg-white">
    <div className="max-w-4xl mx-auto px-6 md:px-12">
      <div className="flex items-center gap-3 mb-12">
        <Briefcase className="text-blue-600" size={28} />
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Work Experience</h2>
      </div>

      <div className="space-y-16 relative">
        {EXPERIENCES.map((exp, index) => (
          <div key={index} className="relative pl-8 md:pl-0">
            {/* Mobile timeline line */}
            <div className="md:hidden absolute left-0 top-2 bottom-0 w-px bg-gray-200" />
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-baseline">
              <div className="md:w-1/4 mb-4 md:mb-0">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {exp.period}
                </span>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.role}</h3>
                <div className="text-lg text-blue-600 font-medium mb-6">{exp.company}</div>
                
                <div className="space-y-8">
                  {exp.projects.map((project, pIndex) => (
                    <div key={pIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{project.name}</h4>
                        {project.period !== 'Project' && (
                          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">
                            {project.period}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {project.description}
                      </p>
                      {project.tech.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, tIndex) => (
                            <span key={tIndex} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-md font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

// Skills Section Component
const SkillsSection = React.memo(() => (
  <section id="skills" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex items-center gap-3 mb-12 justify-center">
        <Terminal className="text-blue-600" size={28} />
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center">Technical Arsenal</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SKILL_CATEGORIES.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center mb-6`}>
              <category.icon className={category.color} size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">{category.title}</h3>
            <ul className="space-y-3">
              {category.skills.map((skill, sIndex) => (
                <li key={sIndex} className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
));

// Education Section Component
const EducationSection = React.memo(() => (
  <section id="education" className="py-24 bg-white">
    <div className="max-w-4xl mx-auto px-6 md:px-12">
      <div className="flex items-center gap-3 mb-12">
        <GraduationCap className="text-blue-600" size={28} />
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Education</h2>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex justify-between items-start hover:border-blue-200 transition-colors group">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Telkom University</h3>
          <p className="text-gray-600 font-medium">Engineering Physics</p>
          <p className="text-sm text-gray-500 mt-2">GPA: 2.93</p>
        </div>
        <div className="hidden sm:block text-gray-400">
          <GraduationCap size={48} strokeWidth={1} />
        </div>
      </div>
    </div>
  </section>
));

// Footer Component
const Footer = React.memo(() => (
  <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
    <div className="max-w-7xl mx-auto px-6">
      <p>© {new Date().getFullYear()} - Designed & Built for a Senior Fullstack Developer.</p>
    </div>
  </footer>
));

// Main Page Component
export default function Page() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 50);
      
      const current = SECTIONS.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= window.innerHeight / 2;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Navigation activeSection={activeSection} onNavigate={scrollTo} isScrolled={isScrolled} />
      <main>
        <HeroSection onNavigate={scrollTo} />
        <ExperienceSection />
        <SkillsSection />
        <EducationSection />
      </main>
      <Footer />
    </div>
  );
}
