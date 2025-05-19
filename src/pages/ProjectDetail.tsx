
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
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

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/src/data/projects.json")
      .then((res) => res.json())
      .then((projects: Project[]) => {
        const found = projects.find(p => p.id === id);
        setProject(found || null);
      });
  }, [id]);

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600 mb-4">Project not found</p>
        <Link to="/projects" className="inline-flex items-center gap-1 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="font-inter min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-4">
          <Link to="/projects" className="inline-flex items-center gap-1 text-primary hover:underline">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>

        {project.image && (
          <div className="w-full mb-6 rounded-lg overflow-hidden shadow">
            <img
              src={project.image + "?auto=format&fit=crop&w=900&q=80"}
              alt={project.name}
              className="w-full h-64 object-cover border"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-3">{project.name}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map(tech => (
            <span
              key={tech}
              className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold"
            >
              {tech}
            </span>
          ))}
        </div>
        <article className="prose lg:prose-lg max-w-none text-gray-800 mb-8">
          <p>{project.description}</p>
        </article>
        <div className="flex gap-4 mt-6">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-semibold text-sm"
          >
            View on GitHub
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600 transition-colors font-semibold text-sm"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
