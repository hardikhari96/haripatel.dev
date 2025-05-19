
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: string;
  name: string;
  description: string;
  github: string;
  live?: string;
  tech: string[];
  image?: string;
  category: string;
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetch("/src/data/projects.json")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const uniqueCategories = ['All', ...new Set(projects.map(project => project.category))];

  const filteredProjects = projects.filter(project => {
    if (selectedCategory === 'All') return true;
    return project.category === selectedCategory;
  });

  return (
    <div className="font-inter min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Projects</h1>
        
        {/* Category Tags */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {uniqueCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="hover:shadow-xl transition-shadow"
            >
              <ProjectCard {...project} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
