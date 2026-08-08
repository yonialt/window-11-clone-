import React from 'react';
import { DeveloperProfile } from '../types';
import { Download, Briefcase, GraduationCap, Award } from 'lucide-react';

interface ResumeWindowProps {
  profile: DeveloperProfile;
}

const EXPERIENCE = [
  {
    role: 'IT Intern',
    company: 'Bank of Abyssinia, Ethiopia',
    period: 'Internship',
    description:
      'Provided technical support to employees by diagnosing and resolving hardware and software issues. Troubleshot network connectivity problems and user access issues, and supported OS installation, configuration, and maintenance.',
  },
  {
    role: 'Freelance Backend Developer',
    company: 'Self-employed',
    period: 'Freelance',
    description:
      'Developed backend applications and RESTful APIs using Spring Boot and Express.js. Designed secure authentication and authorization systems using JWT, integrated PostgreSQL and MongoDB databases, and delivered functional solutions including deployment and testing.',
  },
];

const EDUCATION = [
  { degree: 'BSc Computer Science', school: 'University of Gondar', year: 'Graduated' },
];

const CERTIFICATIONS = [
  { name: 'AWS Cloud Training', issuer: 'Amazon Web Services' },
  { name: 'Microsoft Azure Fundamentals Training', issuer: 'Microsoft' },
  { name: 'Google Cloud Training', issuer: 'Google Cloud' },
];

export const ResumeWindow: React.FC<ResumeWindowProps> = ({ profile }) => {
  const handleDownload = () => {
    const content = `
${profile.name}
${profile.role}
${profile.email} | ${profile.location}
${profile.github} | ${profile.linkedin}

EXPERIENCE
${EXPERIENCE.map((e) => `${e.role} at ${e.company} (${e.period})\n${e.description}`).join('\n\n')}

EDUCATION
${EDUCATION.map((e) => `${e.degree} — ${e.school} (${e.year})`).join('\n')}

CERTIFICATIONS
${CERTIFICATIONS.map((c) => `${c.name} — ${c.issuer}`).join('\n')}
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-auto p-6" style={{ fontFamily: 'var(--win11-font)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">{profile.name}</h1>
            <p className="text-blue-400 text-sm">{profile.role}</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
        </div>

        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Experience
          </h2>
          <div className="space-y-4">
            {EXPERIENCE.map((exp) => (
              <div key={exp.role} className="bg-white/5 rounded-xl p-4 border border-white/8">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-medium text-white">{exp.role}</h3>
                  <span className="text-xs text-slate-500">{exp.period}</span>
                </div>
                <p className="text-xs text-blue-400 mb-2">{exp.company}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            Education
          </h2>
          <div className="space-y-3">
            {EDUCATION.map((edu) => (
              <div key={edu.degree} className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/8">
                <GraduationCap className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <p className="text-sm text-white">{edu.degree}</p>
                  <p className="text-xs text-slate-400">{edu.school} · {edu.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            Certifications
          </h2>
          <div className="space-y-3">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.name} className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/8">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm text-white">{cert.name}</p>
                  <p className="text-xs text-slate-400">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
