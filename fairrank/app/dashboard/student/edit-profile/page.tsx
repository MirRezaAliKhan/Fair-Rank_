'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import axios from 'axios';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    cgpa: { value: 0, verified: false },
    skills: [],
    projects: [],
    experience: [],
    education: { institution: '', branch: '', graduationYear: new Date().getFullYear() },
    socialLinks: { github: '', linkedin: '', portfolio: '' },
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(userData);
        setUser(user);

        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/students/profile?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setFormData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/students/profile',
        { userId: user.id, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        router.push('/dashboard/student');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: '', proficiency: 'intermediate', verified: false }],
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: '', description: '', technologies: [], githubLink: '', liveLink: '', highlights: [] },
      ],
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { title: '', company: '', duration: '', description: '' }],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn userRole="student" />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar isLoggedIn userRole="student" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard/student" className="text-cyan-600 hover:text-cyan-700 font-medium mb-6 inline-flex">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Education Section */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={formData.education?.institution || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        education: { ...formData.education, institution: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Your college/university"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <input
                    type="text"
                    value={formData.education?.branch || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        education: { ...formData.education, branch: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="CSE, ECE, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={formData.cgpa?.value || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cgpa: { ...formData.cgpa, value: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="border-b pb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>

              <div className="space-y-4">
                {formData.skills?.map((skill: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const newSkills = [...formData.skills];
                          newSkills[idx].name = e.target.value;
                          setFormData({ ...formData, skills: newSkills });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Skill name"
                      />
                    </div>
                    <div>
                      <label htmlFor={`skill-proficiency-${idx}`} className="sr-only">
                        Skill proficiency
                      </label>
                      <select
                        id={`skill-proficiency-${idx}`}
                        aria-label="Skill proficiency"
                        value={skill.proficiency}
                        onChange={(e) => {
                          const newSkills = [...formData.skills];
                          newSkills[idx].proficiency = e.target.value;
                          setFormData({ ...formData, skills: newSkills });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newSkills = formData.skills.filter((_: any, i: number) => i !== idx);
                        setFormData({ ...formData, skills: newSkills });
                      }}
                      aria-label={`Remove ${skill.name || 'skill'}`}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="border-b pb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>

              <div className="space-y-4">
                {formData.projects?.map((project: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => {
                        const newProjects = [...formData.projects];
                        newProjects[idx].title = e.target.value;
                        setFormData({ ...formData, projects: newProjects });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Project title"
                    />

                    <textarea
                      value={project.description}
                      onChange={(e) => {
                        const newProjects = [...formData.projects];
                        newProjects[idx].description = e.target.value;
                        setFormData({ ...formData, projects: newProjects });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Project description"
                      rows={3}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="url"
                        value={project.githubLink}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          newProjects[idx].githubLink = e.target.value;
                          setFormData({ ...formData, projects: newProjects });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="GitHub link"
                      />
                      <input
                        type="url"
                        value={project.liveLink}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          newProjects[idx].liveLink = e.target.value;
                          setFormData({ ...formData, projects: newProjects });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Live link"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newProjects = formData.projects.filter((_: any, i: number) => i !== idx);
                        setFormData({ ...formData, projects: newProjects });
                      }}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Delete Project
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks?.github || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, github: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks?.linkedin || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks?.portfolio || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, portfolio: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <Link
                href="/dashboard/student"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
