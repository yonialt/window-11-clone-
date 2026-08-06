import React from 'react';

const SKILL_CATEGORIES = [
  {
    name: 'Frontend',
    color: '#0078D4',
    skills: [
      { name: 'React / Next.js', level: 95 },
      { name: 'TypeScript', level: 92 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Vue.js', level: 75 },
      { name: 'HTML/CSS', level: 98 },
    ],
  },
  {
    name: 'Backend',
    color: '#107C10',
    skills: [
      { name: 'Node.js / Express', level: 88 },
      { name: 'Python / FastAPI', level: 80 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 82 },
      { name: 'REST / GraphQL', level: 90 },
    ],
  },
  {
    name: 'DevOps & Tools',
    color: '#8764B8',
    skills: [
      { name: 'Docker', level: 78 },
      { name: 'AWS / GCP', level: 72 },
      { name: 'Git / GitHub', level: 95 },
      { name: 'CI/CD', level: 80 },
      { name: 'Linux', level: 85 },
    ],
  },
  {
    name: 'Design & UI',
    color: '#FFB900',
    skills: [
      { name: 'Figma', level: 88 },
      { name: 'UI/UX Design', level: 85 },
      { name: 'Design Systems', level: 90 },
      { name: 'Motion / Animation', level: 82 },
      { name: 'Accessibility', level: 78 },
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
