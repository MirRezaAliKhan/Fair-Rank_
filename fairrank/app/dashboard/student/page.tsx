'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, ExternalLink } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import ScoreCard from '@/app/components/ScoreCard';
import axios from 'axios';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ussScore, setUSSScore] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          window.location.href = '/login';
          return;
        }

        const user = JSON.parse(userData);
        setUser(user);

        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/students/profile?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProfile(response.data.data);
          setUSSScore(response.data.data.uss?.score || 0);
          setConfidence(response.data.data.uss?.confidence || 0);
          setBreakdown(response.data.data.uss?.breakdown || null);
          setSuggestions(response.data.data.improvementSuggestions || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn userRole="student" />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar isLoggedIn userRole="student" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">A sharpened overview of your score, priorities, and next steps.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr] mb-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 font-semibold mb-3">
                  Universal Standard Score
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-6xl font-semibold text-slate-900">{ussScore}</p>
                    <p className="text-sm text-slate-500">out of 100</p>
                  </div>
                  <div className="flex-1">
                    <progress
                      className="progress-track mb-2"
                      value={Math.min(Math.max(ussScore, 0), 100)}
                      max={100}
                      aria-label="USS progress"
                    />
                    <p className="text-sm text-slate-500">Current profile momentum</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-cyan-50 p-5 border border-cyan-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-700 font-semibold mb-2">
                    Confidence
                  </p>
                  <p className="text-3xl font-semibold text-cyan-900">{confidence}%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold mb-2">
                    Skills added
                  </p>
                  <p className="text-3xl font-semibold text-slate-900">{profile?.skills?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Next step</h2>
                  <p className="text-sm text-gray-500">Keep your profile competitive.</p>
                </div>
                <Link
                  href="/dashboard/student/edit-profile"
                  className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Update profile
                </Link>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Add or verify your top skills to improve match quality.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Share at least one active project with technologies and outcomes.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile summary</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Institution:</span>{' '}
                  {profile?.education?.institution || 'Not provided'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Branch:</span>{' '}
                  {profile?.education?.branch || 'Not provided'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">CGPA:</span>{' '}
                  {profile?.cgpa?.value ?? 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Social links:</span>{' '}
                  {profile?.socialLinks?.length ? `${profile.socialLinks.length} added` : 'None yet'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {breakdown && (
          <section className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Detailed breakdown</h2>
                <p className="text-sm text-gray-500">See the strengths that drive your USS score.</p>
              </div>
              <Link
                href="/dashboard/student/assessments"
                className="inline-flex items-center rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
              >
                Review assessments
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {[
                { label: 'Academics', key: 'academics', icon: '📚' },
                { label: 'Skills', key: 'skills', icon: '💻' },
                { label: 'Projects', key: 'projects', icon: '🚀' },
                { label: 'Experience', key: 'experience', icon: '💼' },
                { label: 'Professional', key: 'behavioral', icon: '🤝' },
              ].map((item) => (
                <ScoreCard
                  key={item.key}
                  title={item.label}
                  score={breakdown[item.key]?.score || 0}
                  icon={item.icon}
                  trust={breakdown[item.key]?.trust}
                />
              ))}
            </div>
          </section>
        )}

        {suggestions.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Improvement opportunities</h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="text-base font-semibold text-slate-900">{suggestion.category}</p>
                    {suggestion.potentialImpact && (
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                        +{suggestion.potentialImpact} pts
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Core strengths</h2>
                <p className="text-sm text-gray-500">Your highest impact skills and projects.</p>
              </div>
              <Link href="/dashboard/student/edit-profile" className="text-cyan-600 font-semibold hover:text-cyan-700">
                Add more
              </Link>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-[0.2em] mb-4">Skills</h3>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {profile.skills.map((skill: any, idx: number) => (
                      <div key={idx} className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                        <p className="font-semibold text-gray-900">{skill.name}</p>
                        <p className="text-xs text-gray-500 capitalize mt-1">{skill.proficiency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No skills added yet.</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-[0.2em] mb-4">Projects</h3>
                {profile?.projects && profile.projects.length > 0 ? (
                  <div className="space-y-3">
                    {profile.projects.slice(0, 3).map((project: any, idx: number) => (
                      <div key={idx} className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">{project.title}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {project.description || 'Project details not available.'}
                            </p>
                          </div>
                          {project.githubLink && <ExternalLink className="w-4 h-4 text-cyan-600" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          {(Array.isArray(project.technologies)
                            ? project.technologies.join(', ')
                            : project.technologies) || 'No technologies listed'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No recent projects added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile health</h2>
            <div className="space-y-4">
              <div className="rounded-3xl bg-cyan-50 p-5 border border-cyan-100">
                <p className="text-sm text-cyan-700 font-semibold">Education</p>
                <p className="mt-2 text-gray-900 font-semibold">{profile?.education?.institution || 'No institution set'}</p>
                <p className="text-sm text-slate-500">{profile?.education?.branch || 'Branch not available'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-sm text-slate-700 font-semibold">Academic score</p>
                <p className="mt-2 text-gray-900 font-semibold">{profile?.cgpa?.value ?? 'N/A'} / 10</p>
                {profile?.cgpa?.verified && <p className="text-sm text-green-600 mt-1">CGPA verified</p>}
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-sm text-slate-700 font-semibold">Social links</p>
                <p className="mt-2 text-gray-900 font-semibold">
                  {profile?.socialLinks?.length ? `${profile.socialLinks.length} link(s)` : 'None yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
