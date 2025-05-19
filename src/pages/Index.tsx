import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import SkillsSection from "@/components/SkillsSection";
import AboutSection from "@/components/AboutSection";
import { Mail, MapPin, Link as LinkIcon, Linkedin, FileDown } from "lucide-react";
import projects from "@/data/projects.json";

// Update project data to match the structure expected by ProjectCard
const updatedProjects = projects.slice(0, 3);

const Index = () => {
  return (
    <div className="font-inter">
      <Navbar />
      {/* HERO SECTION */}
      <section
        id="home"
        className="min-h-[50vh] bg-white bg-gradient-to-b from-white to-gray-50 flex flex-col justify-center items-center py-20"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Harikrushna Patel</h1>
          <h2 className="text-lg md:text-xl font-medium text-gray-600 mb-4">Full Stack Developer</h2>
          <p className="text-gray-700 mb-4">
            Building scalable apps and robust systems.
            <br /> Passionate about solving problems and learning new technologies.
          </p>
          <div className="flex flex-col md:flex-row gap-2 justify-center items-center text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <MapPin size={16} /> <strong>Ahmedabad, India</strong>
            </span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="flex items-center gap-1">
              <Mail size={16} /> <strong>Email:</strong>
              <a
                href="mailto:mail@haripatel.dev"
                className="underline hover:text-primary"
              >
                mail@haripatel.dev
              </a>
            </span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="flex items-center gap-1">
              <LinkIcon size={16} />
              <strong>Website:</strong>
              <a
                href="https://haripatel.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary ml-1"
              >
                haripatel.dev
              </a>
            </span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="flex items-center gap-1">
              <Linkedin size={16} />
              <a
                href="https://www.linkedin.com/in/iharipatel/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary ml-1"
              >
                LinkedIn
              </a>
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
            {updatedProjects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <SkillsSection />

      {/* CONTACT SECTION REMOVED FROM HOME PAGE */}

      {/* FOOTER */}
      <footer className="py-8 text-gray-400 text-center text-xs bg-white border-t">
        © {new Date().getFullYear()} Harikrushna Patel.
      </footer>
    </div>
  );
};

export default Index;
