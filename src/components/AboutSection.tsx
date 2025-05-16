
import React from "react";
import { Briefcase, Book, Award } from "lucide-react";

const experience = [
  {
    title: "Sr. Full Stack Developer",
    company: "Credify Technology Pvt. Ltd.",
    duration: "2022 - Present",
    details: [
      "Managed project development, including feature implementation, bug fixing, and codebase maintenance.",
      "Collaborated with cross-functional teams to design and develop an investment product.",
      "Interacted with vendors for requirements gathering and third-party service integration.",
      "Designed and optimized database structures, ensuring scalability and data integrity.",
      "Participate in key decision-making processes, sharing insights for product enhancements.",
    ]
  },
  {
    title: "Full Stack Developer",
    company: "Aarya Infoline",
    duration: "2020 - 2022",
    details: [
      "Developed both frontend and backend for various projects, including a badminton tournament scoring system.",
      "Utilized Google Cloud App Engine for managing code deployment and services."
    ]
  },
  {
    title: "Full Stack Developer",
    company: "Denim Softwares",
    duration: "2019 - 2020",
    details: [
      "Contributed to PHP, Bootstrap, WordPress core applications.",
      "Managed server environments, debugging, and ensuring smooth deployments."
    ]
  },
  {
    title: "Proprietor",
    company: "Software company",
    duration: "-", details: []
  }
];

const education = [
  {
    degree: "Master of Computer Applications",
    institution: "BAOU University",
    year: "2024 - pursuing"
  },
  {
    degree: "Bachelor of Science in Physics",
    institution: "Sardar Patel University",
    year: "2017 - 2019"
  },
  {
    degree: "Computer Science & Applications",
    institution: "Information Technology Centre",
    year: "2020"
  }
];

const certificates = [
  {
    name: "Neo4j Cypher Fundamentals",
    issuer: "neo4j | Graph Academy",
    year: "2023"
  }
];

const AboutSection = () => (
  <section id="about" className="py-16 bg-white border-b border-gray-100">
    <div className="container mx-auto px-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span>About</span>
      </h2>
      <div className="mb-10">
        <p className="text-gray-700 mb-3">
          Experienced Full Stack Developer with a strong background in developing web applications, collaborating with cross-functional teams, and delivering scalable solutions. Skilled in Angular, Node.js, FastAPI, cloud platforms, DevOps, and database design. Passionate about problem-solving and continuous learning.
        </p>
      </div>
      {/* Experience */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Professional Experience
        </h3>
        <div className="space-y-6">
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold">{exp.title} <span className="font-normal text-gray-800">@ {exp.company}</span></div>
              <div className="text-sm text-gray-500 mb-1">{exp.duration}</div>
              <ul className="list-disc ml-5 text-gray-700 mb-2">
                {exp.details.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Education */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Book className="w-5 h-5 text-primary" /> Education
        </h3>
        <ul className="space-y-2">
          {education.map((edu, i) => (
            <li key={i}>
              <span className="font-medium">{edu.degree}</span> - {edu.institution} <span className="text-gray-500 text-sm">({edu.year})</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Certificates */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Certificates
        </h3>
        <ul>
          {certificates.map((cert, i) => (
            <li key={i}>
              <span className="font-medium">{cert.name}</span> - {cert.issuer} <span className="text-gray-500 text-sm">({cert.year})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default AboutSection;
