'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import ScoreCard from '@/app/components/ScoreCard';
import axios from 'axios';
import { ExternalLink, Github, Briefcase } from 'lucide-react';

export default function CandidateDetailPage() {
  const params = useParams();
  const applicationId = params.id;
  const [application, setApplication] = useState<any>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch application details
        const appRes = await axios.get(`/api/applications/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (appRes.data.success) {
          setApplication(appRes.data.data);
          setCandidate(appRes.data.data.studentId);
        }
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchData();
    }
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn userRole="recruiter" />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn userRole="recruiter" />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Candidate not found</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar isLoggedIn userRole="recruiter" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard/recruiter" className="text-cyan-600 hover:text-cyan-700 font-medium mb-6 inline-flex">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Candidate Profile
              </h1>
              <p className="text-gray-600">
                Rank #{application?.rank} | Applied {new Date(application?.appliedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text mb-2">
                {application?.score}
              </div>
              <p className="text-gray-600 font-medium">Universal Standard Score</p>
            </div>
          </div>

          <label htmlFor="application-status" className="sr-only">
            Application status
          </label>
          <select
            id="application-status"
            aria-label="Application status"
            value={application?.status}
            onChange={(e) => {
              // Handle status update
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlist</option>
            <option value="rejected">Reject</option>
            <option value="selected">Select</option>
          </select>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Academics', score: application?.scoreBreakdown?.academics, icon: '📚' },
            { label: 'Skills', score: application?.scoreBreakdown?.skills, icon: '💻' },
            { label: 'Projects', score: application?.scoreBreakdown?.projects, icon: '🚀' },
            { label: 'Experience', score: application?.scoreBreakdown?.experience, icon: '💼' },
            { label: 'Professional', score: application?.scoreBreakdown?.behavioral, icon: '🤝' },
          ].map((item, idx) => (
            <ScoreCard key={idx} title={item.label} score={item.score} icon={item.icon} />
          ))}
        </div>

        {/* Candidate Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Education */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Institution</p>
                  <p className="text-lg font-medium text-gray-900">
                    {candidate.education?.institution || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="text-lg font-medium text-gray-900">
                    {candidate.education?.branch || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CGPA</p>
                  <p className="text-lg font-medium text-gray-900">
                    {candidate.cgpa?.value || 0} / 10
                    {candidate.cgpa?.verified && (
                      <span className="text-xs bg-green-100 text-green-700 ml-2 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              {candidate.skills && candidate.skills.length > 0 ? (
                <div className="space-y-3">
                  {candidate.skills.map((skill: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{skill.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{skill.proficiency}</p>
                      </div>
                      <div className="flex gap-2">
                        {skill.assessmentScore && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                            {skill.assessmentScore}%
                          </span>
                        )}
                        {skill.verified && (
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No skills added</p>
              )}
            </div>

            {/* Projects */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
              {candidate.projects && candidate.projects.length > 0 ? (
                <div className="space-y-6">
                  {candidate.projects.map((project: any, idx: number) => (
                    <div key={idx} className="border-b last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {project.title}
                        </h3>
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} GitHub repository`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>

                      <p className="text-gray-700 mb-3">{project.description}</p>

                      <div className="mb-3">
                        <p className="text-xs text-gray-600 font-semibold mb-2">
                          Technologies
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.map((tech: string) => (
                            <span
                              key={tech}
                              className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {project.highlights && project.highlights.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-2">
                            Highlights
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {project.highlights.map((highlight: string) => (
                              <li key={highlight}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No projects added</p>
              )}
            </div>

            {/* Experience */}
            {candidate.experience && candidate.experience.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Experience
                </h2>
                <div className="space-y-4">
                  {candidate.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-500">{exp.duration}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <div className="space-y-3">
                {candidate.socialLinks?.github && (
                  <a
                    href={candidate.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open candidate GitHub profile"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="font-medium text-gray-900">GitHub</span>
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                )}

                {candidate.socialLinks?.linkedin && (
                  <a
                    href={candidate.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open candidate LinkedIn profile"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="font-medium text-gray-900">LinkedIn</span>
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                )}

                {candidate.socialLinks?.portfolio && (
                  <a
                    href={candidate.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open candidate portfolio"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="font-medium text-gray-900">Portfolio</span>
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                )}
              </div>
            </div>

            {/* Score Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Score Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    OVERALL USS
                  </p>
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">
                    {application?.score}
                  </p>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-600 font-semibold mb-2">
                    HIGHEST STRENGTH
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.max(
                      application?.scoreBreakdown?.academics || 0,
                      application?.scoreBreakdown?.skills || 0,
                      application?.scoreBreakdown?.projects || 0,
                      application?.scoreBreakdown?.experience || 0,
                      application?.scoreBreakdown?.behavioral || 0
                    )} points
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
