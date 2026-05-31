import React from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { ArrowRight, TrendingUp, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Beyond CGPA: <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Smarter, Fairer Placements</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Replace traditional CGPA-based shortlisting with an adaptive, trust-aware scoring system that evaluates skills, projects, and real capability over raw grades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=student"
                className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition group"
              >
                Join as Student
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/signup?role=recruiter"
                className="inline-flex items-center justify-center border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Recruit Smarter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600">Revolutionize how you evaluate and get evaluated</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-cyan-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Adaptive Scoring System
              </h3>
              <p className="text-gray-600">
                Universal Standard Score (USS) that evaluates academics, skills, projects, experience, and behavioral indicators with dynamically adjustable weights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Verified Data
              </h3>
              <p className="text-gray-600">
                Trust-aware weighting system that gives higher priority to verified inputs like assessments and external data while validating self-reported information.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Shortlisting
              </h3>
              <p className="text-gray-600">
                Real-time ranking and filtering with recruiter-controlled weight adjustments. See candidates ranked instantly as you customize your preferences.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                Students and recruiters connected through intelligent role matching. Get ranked fairly based on customized criteria relevant to each position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Traditional vs FairRank</h2>
            <p className="text-xl text-gray-600">Why fair evaluation matters</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Traditional */}
            <div className="border border-gray-200 rounded-xl p-8 bg-gray-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Traditional Placement</h3>
              <ul className="space-y-4">
                {[
                  'CGPA-based shortlisting (inflexible)',
                  'No skill verification',
                  'Projects ignored in evaluation',
                  'Manual, slow process',
                  'Bias toward top colleges',
                  'One-size-fits-all approach',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="text-red-500 text-xl">✕</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FairRank */}
            <div className="border-2 border-cyan-500 rounded-xl p-8 bg-gradient-to-br from-cyan-50 to-blue-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">FairRank Approach</h3>
              <ul className="space-y-4">
                {[
                  'Holistic evaluation of all factors',
                  'Verified skill assessments',
                  'Projects heavily weighted',
                  'Instant, real-time matching',
                  'Merit-based, college-agnostic',
                  'Customizable per role',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Student CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            For Students: Prove Your Worth Beyond CGPA
          </h2>
          <p className="text-lg text-cyan-100 mb-8 max-w-2xl mx-auto">
            Showcase your projects, skills, and real capability. Get matched with roles where you'll genuinely excel, not just pass the CGPA filter.
          </p>
          <Link
            href="/signup?role=student"
            className="inline-flex items-center justify-center bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition group"
          >
            Start Building Your Profile
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>

      {/* Recruiter CTA Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            For Recruiters: Find Candidates That Actually Fit
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Define what really matters for your role. Adjust weights in real-time and discover high-quality candidates beyond CGPA constraints.
          </p>
          <Link
            href="/signup?role=recruiter"
            className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition group"
          >
            Start Recruiting Smarter
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">FairRank</h4>
              <p className="text-gray-400 text-sm">
                Fair, transparent, and intelligent placement evaluation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 FairRank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
