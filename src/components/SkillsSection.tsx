
import { useEffect, useState } from "react";

interface Skill {
  title: string;
  details: string[];
}

const SkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/src/data/skills.json")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data.skills);
      })
      .catch(() => {
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
};

export default SkillsSection;
