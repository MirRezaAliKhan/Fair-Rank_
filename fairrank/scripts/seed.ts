/**
 * Demo Data Seed Script
 * Run with: npm run seed
 *
 * This creates sample students and a recruiter for testing the system
 */

import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { stringifyJsonFields } from '@/lib/jsonHelpers';

const studentProfileFields = [
  'cgpa',
  'skills',
  'projects',
  'experience',
  'education',
  'socialLinks',
  'uss',
  'improvementSuggestions',
];

async function seedDatabase() {
  try {
    await prisma.$connect();

    console.log('Connected to the database');

    await prisma.application.deleteMany();
    await prisma.skillAssessment.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.jobRole.deleteMany();
    await prisma.user.deleteMany();

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

    const createdUsers = [];
    for (const student of students) {
      const createdUser = await prisma.user.create({
        data: student,
      });
      createdUsers.push(createdUser);
    }

    console.log(`Created ${createdUsers.length} demo students`);

    const profiles = [
      stringifyJsonFields(
        {
          userId: createdUsers[0].id,
          cgpa: { value: 8.5, verified: true },
          skills: [
            { name: 'React', proficiency: 'advanced', verified: true, assessmentScore: 85 },
            { name: 'Node.js', proficiency: 'advanced', verified: true, assessmentScore: 80 },
            { name: 'SQL', proficiency: 'intermediate', verified: false },
          ],
          projects: [
            {
              title: 'E-commerce Platform',
              description: 'Full-stack e-commerce with React and Node.js',
              technologies: ['React', 'Node.js', 'SQLite', 'Stripe'],
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
          uss: {
            score: 0,
            confidence: 0,
            breakdown: {
              academics: { score: 0, weight: 0.2 },
              skills: { score: 0, weight: 0.3 },
              projects: { score: 0, weight: 0.25 },
              experience: { score: 0, weight: 0.15 },
              behavioral: { score: 0, weight: 0.1 },
            },
            lastUpdated: new Date(),
          },
          improvementSuggestions: [],
        },
        studentProfileFields
      ),
      stringifyJsonFields(
        {
          userId: createdUsers[1].id,
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
          uss: {
            score: 0,
            confidence: 0,
            breakdown: {
              academics: { score: 0, weight: 0.2 },
              skills: { score: 0, weight: 0.3 },
              projects: { score: 0, weight: 0.25 },
              experience: { score: 0, weight: 0.15 },
              behavioral: { score: 0, weight: 0.1 },
            },
            lastUpdated: new Date(),
          },
          improvementSuggestions: [],
        },
        studentProfileFields
      ),
      stringifyJsonFields(
        {
          userId: createdUsers[2].id,
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
          uss: {
            score: 0,
            confidence: 0,
            breakdown: {
              academics: { score: 0, weight: 0.2 },
              skills: { score: 0, weight: 0.3 },
              projects: { score: 0, weight: 0.25 },
              experience: { score: 0, weight: 0.15 },
              behavioral: { score: 0, weight: 0.1 },
            },
            lastUpdated: new Date(),
          },
          improvementSuggestions: [],
        },
        studentProfileFields
      ),
    ];

    for (const profile of profiles) {
      await prisma.studentProfile.create({
        data: profile,
      });
    }

    console.log(`Created ${profiles.length} demo student profiles`);

    await prisma.user.create({
      data: {
        name: 'Hiring Manager',
        email: 'recruiter@example.com',
        password: await hashPassword('password123'),
        role: 'recruiter',
      },
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

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedDatabase();
