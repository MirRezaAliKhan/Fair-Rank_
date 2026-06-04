'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Users, BarChart3, Settings } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import axios from 'axios';

export default function RecruiterDashboard() {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          window.location.href = '/login';
          return;
        }

        const user = JSON.parse(userData);
        setUser(user);

        const token = localStorage.getItem('token');

        // Fetch roles
        const rolesRes = await axios.get(`/api/recruiters/roles?recruiterId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (rolesRes.data.success) {
          setRoles(rolesRes.data.data);
          if (rolesRes.data.data.length > 0) {
            setSelectedRole(rolesRes.data.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch applications when selectedRole changes
  useEffect(() => {
    if (selectedRole) {
      const fetchApplications = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `/api/applications?roleId=${selectedRole}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.success) {
            setApplications(res.data.data);
          }
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      };

      fetchApplications();
    }
  }, [selectedRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn userRole="recruiter" />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar isLoggedIn userRole="recruiter" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">Manage your job roles and review candidates</p>
          </div>
          <Link
            href="/dashboard/recruiter/create-role"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            Create New Role
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Active Roles</h3>
              <BarChart3 className="text-cyan-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{roles.length}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Applications</h3>
              <Users className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Shortlisted</h3>
              <Settings className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {applications.filter((app: any) => app.status === 'shortlisted').length}
            </p>
          </div>
        </div>

        {/* Roles Section */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Roles</h3>
            <div className="space-y-2">
              {roles.length > 0 ? (
                roles.map((role: any) => (
                  <button
                    key={role._id}
                    onClick={() => setSelectedRole(role._id)}
                    className={`w-full text-left p-3 rounded-lg font-medium transition ${
                      selectedRole === role._id
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {role.title}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  No roles yet. Create one!
                </p>
              )}
            </div>
          </div>

          {/* Candidates List */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {selectedRole ? 'Ranked Candidates' : 'Select a role to view candidates'}
            </h3>

            {selectedRole && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div
                    key={app._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          #{app.rank}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Candidate</h4>
                          <p className="text-sm text-gray-600">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">
                          {app.score}
                        </div>
                        <p className="text-xs text-gray-500">USS Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {[
                        { label: 'Academics', score: app.scoreBreakdown.academics },
                        { label: 'Skills', score: app.scoreBreakdown.skills },
                        { label: 'Projects', score: app.scoreBreakdown.projects },
                        { label: 'Experience', score: app.scoreBreakdown.experience },
                        { label: 'Professional', score: app.scoreBreakdown.behavioral },
                      ].map((cat, i) => (
                        <div key={i} className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs font-medium text-gray-600">{cat.label}</p>
                          <p className="text-lg font-bold text-gray-900">{cat.score}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <label htmlFor={`application-status-${app._id}`} className="sr-only">
                        Application status
                      </label>
                      <select
                        id={`application-status-${app._id}`}
                        aria-label="Application status"
                        value={app.status}
                        onChange={() => {
                          // Handle status update
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlist</option>
                        <option value="rejected">Reject</option>
                        <option value="selected">Select</option>
                      </select>
                      <Link
                        href={`/dashboard/recruiter/candidate/${app._id}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium transition"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedRole ? (
              <p className="text-gray-600 text-center py-12">No applications for this role yet</p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
