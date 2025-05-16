
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: string;
  name: string;
  description: string;
  github: string;
  live?: string;
  tech: string[];
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
    <div className="container mx-auto px-4 py-12 font-inter">
      <div className="mb-4">
        <Link to="/projects" className="inline-flex items-center gap-1 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
      <ProjectCard {...project} />
    </div>
  );
};

export default ProjectDetail;
