
import React from "react";

const skills = [
  {
    title: "Frontend Development",
    details: [
      "Angular, React, TypeScript, JavaScript (ES6+)",
      "HTML & CSS, Responsive Design, Bootstrap"
    ]
  },
  {
    title: "Backend Development",
    details: [
      "Node.js, FastAPI (Python) micro-services architecture",
      "Expertise in authentication and authorization (OAuth, JWT)",
      "RabbitMQ, ElasticSearch"
    ]
  },
  {
    title: "Database Development",
    details: [
      "SQL (MySQL, PostgreSQL), NoSQL (MongoDB, Redis)",
      "Database design, optimization, migration"
    ]
  },
  {
    title: "Server Management & DevOps",
    details: [
      "Linux server management, NGINX, Apache, automation",
      "CI/CD: GitHub, GitLab, Bitbucket",
      "Docker, Kubernetes",
      "Cloud: AWS, DigitalOcean, GCP, Oracle Cloud"
    ]
  },
  {
    title: "Additional Skills",
    details: [
      "Git, Teamwork, Problem Solving",
      "Strong collaborative and communication skills"
    ]
  }
];

const SkillsSection = () => (
  <section id="skills" className="py-12 bg-white animate-fade-in">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Skills</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div key={skill.title} className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-semibold mb-2">{skill.title}</h3>
            <ul className="list-disc list-inside text-gray-700">
              {skill.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
