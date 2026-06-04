'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const roleOptions = [
  {
    key: 'student',
    label: 'Student',
    description: 'Create a profile, track your USS score, and apply to matched roles.',
  },
  {
    key: 'recruiter',
    label: 'Recruiter',
    description: 'Post hiring roles, review ranked candidates, and manage your pipeline.',
  },
];

export default function SignupPage() {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialRole = searchParams.get('role');
    if (initialRole === 'recruiter' || initialRole === 'student') {
      setRole(initialRole);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess(true);

        setTimeout(() => {
          window.location.href = role === 'student' ? '/dashboard/student' : '/dashboard/recruiter';
        }, 1400);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="grid gap-8 max-w-6xl w-full lg:grid-cols-[1.2fr_0.9fr]">
        <section className="rounded-[2rem] bg-white/95 border border-white/10 p-10 shadow-2xl backdrop-blur-xl text-slate-900">
          <div className="max-w-xl">
            <p className="inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-700">
              Welcome to FairRank
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Choose a role below and sign up to start matching talent, tracking scores, and managing applications.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {roleOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setRole(option.key)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    role === option.key
                      ? 'border-cyan-300 bg-cyan-50 text-slate-900 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-lg font-semibold">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-slate-900/95 border border-cyan-500/20 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              Register
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">{role === 'student' ? 'Student sign up' : 'Recruiter sign up'}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Enter your details to set up your account and continue to your dashboard.
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-200">
              Account created successfully. Redirecting now...
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 transition focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 transition focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="jane@yourdomain.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 transition focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 transition focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-cyan-300 hover:text-white underline">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
