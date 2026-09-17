import React from 'react';

const SKILL_CATEGORIES = [
  {
    name: 'Frontend',
    color: '#0078D4',
    skills: [
      { name: 'React', level: 88 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 86 },
      { name: 'HTML / CSS', level: 92 },
    ],
  },
  {
    name: 'Backend Development',
    color: '#107C10',
    skills: [
      { name: 'Java / Spring Boot', level: 88 },
      { name: 'Node.js / Express.js', level: 86 },
      { name: 'NestJS', level: 75 },
      { name: 'REST APIs & JWT Auth', level: 90 },
      { name: 'Microservices', level: 78 },
    ],
  },
  {
    name: 'Databases',
    color: '#00B7C3',
    skills: [
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 82 },
      { name: 'SQL', level: 88 },
      { name: 'Prisma ORM', level: 80 },
      { name: 'Hibernate / JPA', level: 82 },
    ],
  },
  {
    name: 'Cloud & DevOps',
    color: '#8764B8',
    skills: [
      { name: 'AWS', level: 76 },
      { name: 'Microsoft Azure', level: 74 },
      { name: 'Google Cloud (GCP)', level: 72 },
      { name: 'Docker', level: 78 },
      { name: 'Git / GitHub & CI/CD', level: 88 },
    ],
  },
  {
    name: 'Networking & IT Support',
    color: '#FF8C00',
    skills: [
      { name: 'TCP/IP, DNS, DHCP', level: 84 },
      { name: 'VPN & OSI Model', level: 80 },
      { name: 'Windows / Linux Administration', level: 82 },
      { name: 'Hardware & OS Troubleshooting', level: 86 },
    ],
  },
  {
    name: 'AI & Machine Learning',
    color: '#E3008C',
    skills: [
      { name: 'Python', level: 82 },
      { name: 'NumPy / Pandas', level: 80 },
      { name: 'Scikit-learn', level: 76 },
      { name: 'Data Preprocessing', level: 78 },
      { name: 'Classification & Regression', level: 74 },
    ],
  },
];

export const SkillsWindow: React.FC = () => {
  return (
    <div className="h-full overflow-auto p-6" style={{ fontFamily: 'var(--win11-font)' }}>
      <h1 className="text-xl font-semibold text-white mb-6">Skills & Technologies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.name} className="bg-white/5 rounded-xl p-5 border border-white/8">
            <h2 className="text-sm font-semibold mb-4" style={{ color: cat.color }}>
              {cat.name}
            </h2>
            <div className="space-y-3">
              {cat.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-slate-500">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${skill.level}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
