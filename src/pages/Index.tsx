
import React from "react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import SkillsSection from "@/components/SkillsSection";
import ContactForm from "@/components/ContactForm";
import AboutSection from "@/components/AboutSection";
import { Phone, Mail, MapPin, Link as LinkIcon } from "lucide-react";

const projects = [
  {
    name: "Investment Platform",
    description: "Web app for investment product management with cross-functional workflow, vendor integration, and scalable architecture.",
    tech: ["Angular", "Node.js", "FastAPI", "GCP", "MongoDB"],
    github: "https://github.com/harikrushnapatel/investment-platform",
    live: "https://investment-demo.haripatel.dev"
  },
  {
    name: "Badminton Tournament System",
    description: "Automated scoring and tournament management with custom backend, real-time stats, and secure user authentication.",
    tech: ["React", "Node.js", "FastAPI", "MySQL"],
    github: "https://github.com/harikrushnapatel/badminton-tournament",
    live: "https://badminton.haripatel.dev"
  },
  {
    name: "Deployment Automation Toolkit",
    description: "Scripts and dashboards for automated CI/CD, deployment to cloud, monitoring, and error reporting.",
    tech: ["Python", "Docker", "Kubernetes", "GCP", "GitHub Actions"],
    github: "https://github.com/harikrushnapatel/deployment-toolkit"
  }
];

const Index = () => {
  return (
    <div className="font-inter">
      <Navbar />
      {/* HERO SECTION */}
      <section id="home" className="min-h-[50vh] bg-white bg-gradient-to-b from-white to-gray-50 flex flex-col justify-center items-center py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Harikrushna Patel</h1>
          <h2 className="text-lg md:text-xl font-medium text-gray-600 mb-4">Full Stack Developer</h2>
          <p className="text-gray-700 mb-4">
            Building scalable apps and robust systems.<br/> Passionate about solving problems and learning new technologies.
          </p>
          <div className="text-sm text-gray-500 flex flex-col md:flex-row gap-2 justify-center items-center mb-2">
            <span className="flex items-center gap-1"><MapPin size={16} /> <strong>Ahmedabad, India</strong></span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="flex items-center gap-1"><Phone size={16} /> <strong>+91-81283-43262</strong></span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="flex items-center gap-1"><Mail size={16} /> <strong>Email:</strong> <a href="mailto:mail@haripatel.dev" className="underline hover:text-primary">mail@haripatel.dev</a></span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="flex items-center gap-1">
              <LinkIcon size={16} />
              <strong>Further Links:</strong>
              <a href="https://haripatel.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary ml-1">haripatel.dev</a>
            </span>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <AboutSection />

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Projects</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <SkillsSection />

      {/* CONTACT SECTION */}
      <section id="contact" className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact</h2>
          <div className="mb-6 flex flex-col items-center text-gray-600 gap-1">
            <div className="flex items-center gap-1">
              <Phone size={16} />
              <span className="ml-1">+91-81283-43262</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={16} />
              <span className="ml-1">mail@haripatel.dev</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="ml-1">Ahmedabad</span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-gray-400 text-center text-xs bg-white border-t">
        © {new Date().getFullYear()} Harikrushna Patel. Portfolio built with Lovable.
      </footer>
    </div>
  );
};

export default Index;
