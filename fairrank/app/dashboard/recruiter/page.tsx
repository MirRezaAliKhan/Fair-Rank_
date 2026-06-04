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

        const rolesRes = await axios.get(`/api/recruiters/roles?recruiterId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (rolesRes.data.success) {
          setRoles(rolesRes.data.data);
          if (rolesRes.data.data.length > 0) {
            setSelectedRole(rolesRes.data.data[0].id);
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

  useEffect(() => {
    if (!selectedRole) {
      setApplications([]);
      return;
    }

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/applications?roleId=${selectedRole}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">Manage your roles, discover the best candidates, and move decisions faster.</p>
          </div>
          <Link
            href="/dashboard/recruiter/create-role"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Active roles</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{roles.length}</p>
              </div>
              <BarChart3 className="text-cyan-500" />
            </div>
            <p className="text-sm text-gray-500">Keep your open searches updated so candidates stay engaged.</p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Applications</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{applications.length}</p>
              </div>
              <Users className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-500">Applications are ranked automatically by USS for fast review.</p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Shortlisted</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{applications.filter((app: any) => app.status === 'shortlisted').length}</p>
              </div>
              <Settings className="text-green-500" />
            </div>
            <p className="text-sm text-gray-500">Track applications you've marked for follow up.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr] mb-8">
          <aside className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Roles</h2>
                <p className="text-sm text-gray-500">Select a role to view candidate rankings.</p>
              </div>
              <Link href="/dashboard/recruiter/create-role" className="text-cyan-600 text-sm font-semibold hover:text-cyan-700">
                New role
              </Link>
            </div>
            <div className="space-y-3">
              {roles.length > 0 ? (
                roles.map((role: any) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                      selectedRole === role.id
                        ? 'border-cyan-300 bg-cyan-50 text-cyan-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold">{role.title}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{role.description || 'No description provided.'}</p>
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No roles have been created yet.</p>
              )}
            </div>
          </aside>

          <section className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedRole ? 'Candidates' : 'Choose a role'}</h2>
                <p className="text-sm text-gray-500">
                  {selectedRole
                    ? 'Review the top applications matched to this role.'
                    : 'Select a job role on the left to display results.'}
                </p>
              </div>
              {selectedRole && (
                <span className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
                  {applications.length} applications
                </span>
              )}
            </div>

            {selectedRole && applications.length > 0 ? (
              <div className="space-y-5">
                {applications.map((app: any) => (
                  <div key={app.id} className="rounded-3xl border border-gray-200 p-6 hover:shadow-lg transition">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Rank #{app.rank}</p>
                        <h3 className="text-lg font-semibold text-gray-900">{app.student?.name || 'Candidate name'}</h3>
                        <p className="text-sm text-gray-500 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="rounded-3xl bg-cyan-50 px-4 py-3 text-center">
                          <p className="text-sm text-cyan-700">Score</p>
                          <p className="text-2xl font-semibold text-cyan-900">{app.score}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-center">
                          <p className="text-sm text-slate-500">Status</p>
                          <p className="text-sm font-semibold text-slate-900 capitalize">{app.status || 'applied'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-5">
                      {[
                        { label: 'Academics', score: app.scoreBreakdown.academics },
                        { label: 'Skills', score: app.scoreBreakdown.skills },
                        { label: 'Projects', score: app.scoreBreakdown.projects },
                        { label: 'Experience', score: app.scoreBreakdown.experience },
                        { label: 'Professional', score: app.scoreBreakdown.behavioral },
                      ].map((metric, index) => (
                        <div key={index} className="rounded-2xl bg-slate-50 p-3 text-center">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{metric.label}</p>
                          <p className="mt-2 text-lg font-semibold text-gray-900">{metric.score ?? 0}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <select
                        aria-label="Application status"
                        value={app.status}
                        onChange={() => {
                          // Handle status update
                        }}
                        className="rounded-3xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="selected">Selected</option>
                      </select>
                      <Link
                        href={`/dashboard/recruiter/candidate/${app.id}`}
                        className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        View candidate
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedRole ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-slate-50 p-10 text-center text-gray-600">
                No applications submitted for this role yet.
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
