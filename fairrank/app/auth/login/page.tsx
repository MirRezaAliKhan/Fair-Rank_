'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const rolePanels = [
  {
    key: 'student',
    title: 'Student',
    description: 'Access role matches, track score growth, and build standout applications.',
  },
  {
    key: 'recruiter',
    title: 'Recruiter',
    description: 'Review ranked candidates, manage roles, and hire faster with data-driven insight.',
  },
];

type AccountType = 'student' | 'recruiter';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('student');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        window.location.href =
          response.data.user.role === 'student'
            ? '/dashboard/student'
            : '/dashboard/recruiter';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr] items-center">
          <section className="rounded-[2rem] bg-white/95 border border-white/10 p-10 shadow-2xl backdrop-blur-xl text-slate-900">
            <div className="max-w-xl">
              <p className="inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-700">
                Secure login for both roles
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight">
                Welcome to FairRank
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Login with your account to unlock personalized job matches,
                candidate insights, and reliable profile scoring.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {rolePanels.map((panel) => (
                  <div
                    key={panel.key}
                    className={`rounded-3xl border p-6 transition ${
                      accountType === panel.key
                        ? 'border-cyan-300 bg-cyan-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <h2 className="text-xl font-semibold text-slate-900">{panel.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {panel.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-slate-900/95 border border-cyan-500/20 p-10 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Sign in
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                {accountType === 'student' ? 'Student access' : 'Recruiter access'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Sign in with your registered email and password to continue.
              </p>
            </div>

            <div className="inline-flex overflow-hidden rounded-full border border-slate-700 bg-slate-950 p-1">
              {(['student', 'recruiter'] as AccountType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={`min-w-[9rem] rounded-full px-4 py-2 text-sm font-semibold transition ${
                    accountType === type
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {type === 'student' ? 'Student' : 'Recruiter'}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
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
                  type="password"
                  name="password"
                  value={formData.password}
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
                {loading ? 'Signing in...' : 'Continue to FairRank'}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-400">
              New to FairRank?{' '}
              <Link href="/signup?role=student" className="text-cyan-300 hover:text-white underline">
                Sign up as Student
              </Link>{' '}
              or{' '}
              <Link href="/signup?role=recruiter" className="text-cyan-300 hover:text-white underline">
                Recruiter
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
