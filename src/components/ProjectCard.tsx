
import React from "react";

type ProjectCardProps = {
  name: string;
  description: string;
  github: string;
  live?: string;
  tech: string[];
};

const ProjectCard: React.FC<ProjectCardProps> = ({ name, description, github, live, tech }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-3 border border-gray-200 animate-fade-in">
    <h3 className="text-xl font-semibold font-inter">{name}</h3>
    <p className="text-gray-600">{description}</p>
    <div className="flex flex-wrap gap-1 mt-2">
      {tech.map((t) => (
        <span
          key={t}
          className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium font-mono"
        >
          {t}
        </span>
      ))}
    </div>
    <div className="mt-4 flex gap-3">
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 text-xs rounded bg-black text-white hover:bg-gray-900 font-semibold transition-colors"
      >
        GitHub
      </a>
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-xs rounded bg-primary text-white hover:bg-primary/90 font-semibold transition-colors"
        >
          Live Demo
        </a>
      )}
    </div>
  </div>
);

export default ProjectCard;
