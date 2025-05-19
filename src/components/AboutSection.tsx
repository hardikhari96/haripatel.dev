import { Briefcase, Book, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface Experience {
  title: string;
  company: string;
  duration: string;
  details: string[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certificate {
  name: string;
  issuer: string;
  year: string;
}

const AboutSection: React.FC = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/src/data/experience.json")
        .then((res) => res.json())
        .then((data) => {
          setExperience(data.experience);
        }),
      fetch("/src/data/education.json")
        .then((res) => res.json())
        .then((data) => {
          setEducation(data.education);
          setCertificates(data.certificates);
        })
    ])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="about" className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span>About</span>
        </h2>

        <div className="mb-10">
          <p className="text-gray-700 mb-3">
            Full Stack Developer with expertise in building scalable web applications and managing cloud infrastructure.
          </p>
          <p className="text-gray-700 mb-3">
            Strong background in both frontend and backend development, with a focus on creating efficient, maintainable code.
          </p>
        </div>

        {/* Experience */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Experience
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
};

export default AboutSection;
