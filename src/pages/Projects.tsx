
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
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/src/data/projects.json")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  return (
    <div className="font-inter min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Projects</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
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
