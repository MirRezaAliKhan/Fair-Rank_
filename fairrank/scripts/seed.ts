/**
 * Demo Data Seed Script
 * Run with: node scripts/seed.js
 * 
 * This creates sample students and recruiters for testing the system
 */

import mongoose from 'mongoose';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { hashPassword } from '../lib/auth';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fairrank';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await StudentProfile.deleteMany({});

    // Create demo students
    const students = [
      {
        name: 'Raj Patel',
        email: 'raj@example.com',
        password: await hashPassword('password123'),
        role: 'student',
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        password: await hashPassword('password123'),
        role: 'student',
      },
      {
        name: 'Arjun Kumar',
        email: 'arjun@example.com',
        password: await hashPassword('password123'),
        role: 'student',
      },
    ];

    const createdUsers = await User.insertMany(students);
    console.log(`Created ${createdUsers.length} demo students`);

    // Create student profiles with sample data
    const profiles = [
      {
        userId: createdUsers[0]._id,
        cgpa: { value: 8.5, verified: true },
        skills: [
          { name: 'React', proficiency: 'advanced', verified: true, assessmentScore: 85 },
          { name: 'Node.js', proficiency: 'advanced', verified: true, assessmentScore: 80 },
          { name: 'MongoDB', proficiency: 'intermediate', verified: false },
        ],
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Full-stack e-commerce with React and Node.js',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            githubLink: 'https://github.com/rajpatel/ecommerce',
            liveLink: 'https://ecommerce-demo.com',
            highlights: ['REST API', 'Authentication', 'Payment Integration'],
          },
          {
            title: 'Todo App',
            description: 'Real-time todo application with WebSockets',
            technologies: ['React', 'Express', 'Socket.io'],
            githubLink: 'https://github.com/rajpatel/todo-app',
            highlights: ['Real-time Sync', 'PWA'],
          },
        ],
        experience: [
          {
            title: 'Junior Developer',
            company: 'TechStartup Inc.',
            duration: '6 months',
            description: 'Developed React components and fixed bugs',
          },
        ],
        education: {
          institution: 'Indian Institute of Technology',
          branch: 'Computer Science',
          graduationYear: 2024,
        },
        socialLinks: {
          github: 'https://github.com/rajpatel',
          linkedin: 'https://linkedin.com/in/rajpatel',
          portfolio: 'https://rajpatel.dev',
        },
      },
      {
        userId: createdUsers[1]._id,
        cgpa: { value: 7.2, verified: true },
        skills: [
          { name: 'Python', proficiency: 'advanced', verified: true, assessmentScore: 90 },
          { name: 'Machine Learning', proficiency: 'intermediate', verified: false },
          { name: 'Data Analysis', proficiency: 'intermediate', verified: false },
        ],
        projects: [
          {
            title: 'ML Model for Sentiment Analysis',
            description: 'Using NLP to analyze customer reviews',
            technologies: ['Python', 'TensorFlow', 'Pandas'],
            githubLink: 'https://github.com/priyasingh/ml-sentiment',
            highlights: ['95% Accuracy', 'Real-world Data'],
          },
          {
            title: 'Data Visualization Dashboard',
            description: 'Interactive dashboard for data insights',
            technologies: ['Python', 'Matplotlib', 'Streamlit'],
            highlights: ['Interactive', 'Real-time Updates'],
          },
          {
            title: 'Web Scraper',
            description: 'Scraping and analyzing news data',
            technologies: ['Python', 'BeautifulSoup', 'Selenium'],
            liveLink: 'https://news-analyzer-demo.com',
            highlights: ['100K+ Articles', 'Daily Updates'],
          },
        ],
        experience: [
          {
            title: 'Data Intern',
            company: 'Analytics Corp',
            duration: '3 months',
            description: 'Analyzed data and created reports',
          },
        ],
        education: {
          institution: 'Delhi University',
          branch: 'Statistics',
          graduationYear: 2024,
        },
        socialLinks: {
          github: 'https://github.com/priyasingh',
          linkedin: 'https://linkedin.com/in/priyasingh',
        },
      },
      {
        userId: createdUsers[2]._id,
        cgpa: { value: 9.1, verified: true },
        skills: [
          { name: 'Java', proficiency: 'expert', verified: true, assessmentScore: 95 },
          { name: 'System Design', proficiency: 'advanced', verified: false },
          { name: 'Databases', proficiency: 'advanced', verified: false },
        ],
        projects: [
          {
            title: 'Distributed Cache System',
            description: 'High-performance cache similar to Redis',
            technologies: ['Java', 'Netty', 'Redis'],
            githubLink: 'https://github.com/arjunkumar/cache-system',
            highlights: ['1M+ req/s', 'Production Ready'],
          },
        ],
        experience: [
          {
            title: 'Software Engineer',
            company: 'Big Tech Co',
            duration: '1 year',
            description: 'Built backend services and optimized queries',
          },
        ],
        education: {
          institution: 'BITS Pilani',
          branch: 'Computer Science',
          graduationYear: 2024,
        },
        socialLinks: {
          github: 'https://github.com/arjunkumar',
          linkedin: 'https://linkedin.com/in/arjunkumar',
        },
      },
    ];

    await StudentProfile.insertMany(profiles);
    console.log(`Created ${profiles.length} demo student profiles`);

    // Create demo recruiter
    const recruiter = await User.create({
      name: 'Hiring Manager',
      email: 'recruiter@example.com',
      password: await hashPassword('password123'),
      role: 'recruiter',
    });

    console.log('Created demo recruiter');
    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Students:');
    console.log('  - raj@example.com / password123');
    console.log('  - priya@example.com / password123');
    console.log('  - arjun@example.com / password123');
    console.log('Recruiter:');
    console.log('  - recruiter@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
