'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import axios from 'axios';

export default function CreateRolePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: [] as string[],
    weights: {
      academics: 0.2,
      skills: 0.3,
      projects: 0.25,
      experience: 0.15,
      behavioral: 0.1,
    },
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillInput],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  const handleWeightChange = (category: string, value: number) => {
    const newWeights = { ...formData.weights };
    (newWeights as any)[category] = value;

    // Normalize weights to sum to 1
    const total = Object.values(newWeights).reduce((a, b) => a + b, 0);
    Object.keys(newWeights).forEach((key) => {
      (newWeights as any)[key] = (newWeights as any)[key] / total;
    });

    setFormData({ ...formData, weights: newWeights });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData!);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        '/api/recruiters/roles',
        {
          recruiterId: user.id,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        router.push('/dashboard/recruiter');
      }
    } catch (error) {
      console.error('Error creating role:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar isLoggedIn userRole="recruiter" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard/recruiter" className="text-cyan-600 hover:text-cyan-700 font-medium mb-6 inline-flex">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job Role</h1>
          <p className="text-gray-600 mb-8">
            Define the position and customize scoring weights for your needs
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Senior React Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe the role, responsibilities, and requirements"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Add a required skill"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-cyan-600 hover:text-cyan-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scoring Weights */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Scoring Weights</h2>
              <p className="text-gray-600 text-sm mb-6">
                Adjust how much each factor contributes to the USS for this role
              </p>

              <div className="space-y-6">
                {[
                  {
                    key: 'academics',
                    label: 'Academics / CGPA',
                    description: 'Weight of academic performance',
                  },
                  {
                    key: 'skills',
                    label: 'Skills',
                    description: 'Weight of technical skills and assessments',
                  },
                  {
                    key: 'projects',
                    label: 'Projects',
                    description: 'Weight of portfolio projects',
                  },
                  {
                    key: 'experience',
                    label: 'Experience',
                    description: 'Weight of professional experience',
                  },
                  {
                    key: 'behavioral',
                    label: 'Professional Presence',
                    description: 'Weight of social profiles and indicators',
                  },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                      <span className="text-lg font-bold text-cyan-600">
                        {Math.round((formData.weights as any)[item.key] * 100)}%
                      </span>
                    </div>
                    <label htmlFor={`${item.key}-weight`} className="sr-only">
                      {item.label} weight
                    </label>
                    <input
                      id={`${item.key}-weight`}
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round((formData.weights as any)[item.key] * 100)}
                      onChange={(e) =>
                        handleWeightChange(
                          item.key,
                          parseInt(e.target.value) / 100
                        )
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <Link
                href="/dashboard/recruiter"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || !formData.title}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
