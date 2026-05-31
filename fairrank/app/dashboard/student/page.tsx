'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit2, ExternalLink } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import ScoreCard from '@/app/components/ScoreCard';
import ProgressBar from '@/app/components/ProgressBar';
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Your Universal Standard Score and profile overview</p>
        </div>

        {/* Main USS Card */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4">
              Your Universal Standard Score
            </h2>

            <div className="flex items-end gap-8 mb-8">
              <div>
                <div className="text-7xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text mb-2">
                  {ussScore}
                </div>
                <p className="text-gray-600">out of 100</p>
              </div>

              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${ussScore}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm">Progress</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-xs text-cyan-600 font-semibold mb-1">CONFIDENCE LEVEL</p>
                <p className="text-2xl font-bold text-cyan-700">{confidence}%</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold mb-1">DATA COMPLETENESS</p>
                <p className="text-2xl font-bold text-blue-700">
                  {profile?.skills?.length || 0} Skills
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3 flex-1">
              <Link
                href="/dashboard/student/edit-profile"
                className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg font-medium transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Link>
              <Link
                href="/dashboard/student/assessments"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition"
              >
                <Plus className="w-4 h-4" />
                Take Assessment
              </Link>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        {breakdown && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Score Breakdown</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  key: 'academics',
                  label: 'Academics',
                  icon: '📚',
                },
                {
                  key: 'skills',
                  label: 'Skills',
                  icon: '💻',
                },
                {
                  key: 'projects',
                  label: 'Projects',
                  icon: '🚀',
                },
                {
                  key: 'experience',
                  label: 'Experience',
                  icon: '💼',
                },
                {
                  key: 'behavioral',
                  label: 'Professional',
                  icon: '🤝',
                },
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
          </div>
        )}

        {/* Improvement Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Improvement Suggestions</h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-cyan-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{suggestion.category}</h3>
                    <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-2 py-1 rounded">
                      +{suggestion.potentialImpact} points
                    </span>
                  </div>
                  <p className="text-gray-700">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Info Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Skills Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Skills</h3>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="space-y-3">
                {profile.skills.map((skill: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{skill.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{skill.proficiency}</p>
                    </div>
                    {skill.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No skills added yet</p>
            )}
            <Link
              href="/dashboard/student/edit-profile"
              className="mt-4 w-full text-center py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition"
            >
              Add Skills
            </Link>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
            {profile?.projects && profile.projects.length > 0 ? (
              <div className="space-y-3">
                {profile.projects.slice(0, 3).map((project: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900">{project.title}</p>
                      {project.githubLink && (
                        <ExternalLink className="w-4 h-4 text-cyan-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {project.technologies.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No projects added yet</p>
            )}
            <Link
              href="/dashboard/student/edit-profile"
              className="mt-4 w-full text-center py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition"
            >
              Add Projects
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
