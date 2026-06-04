# FairRank Setup Guide

This guide will help you set up and run FairRank locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git

## Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
cd fairrank
npm install
```

### 1.2 Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```env
# Database
DATABASE_URL="file:./dev.db"
# For PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/fairrank"

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## Step 2: Database Setup

This project uses Prisma with SQLite by default. The database will be created automatically when you run the app or seed script.

If you want to use PostgreSQL, update `DATABASE_URL` in `.env.local`.

## Step 3: Seed Demo Data

Create sample students and recruiters for testing:

```bash
npm run seed
```

**Demo Credentials:**
- Student 1: `raj@example.com` / `password123`
- Student 2: `priya@example.com` / `password123`
- Student 3: `arjun@example.com` / `password123`
- Recruiter: `recruiter@example.com` / `password123`

## Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

## Testing the Application

### Landing Page
Visit http://localhost:3000 to see the landing page with features and comparison.

### Student Flow
1. Sign up as a student or login with demo credentials
2. Go to dashboard to view your USS score
3. Edit profile to add skills, projects, and experience
4. Take assessments to verify skills
5. See how your score updates

### Recruiter Flow
1. Sign up as a recruiter or login with demo credentials
2. Create a new job role
3. Adjust weights for different evaluation factors
4. See the ranked list of candidates
5. View individual candidate details

## Troubleshooting

### Database Connection Error
- Ensure the `DATABASE_URL` in `.env.local` is correct
- For SQLite, verify the file path is writable
- For PostgreSQL, verify that the database server is running and credentials are valid

### Port 3000 Already in Use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run seed         # Seed demo data

# Code Quality
npm run lint         # Run ESLint
```

## Project Structure

```
app/
├── api/              # API endpoints
├── auth/             # Auth pages (login, signup)
├── components/       # Reusable components
├── dashboard/        # Student & recruiter dashboards
└── page.tsx          # Landing page

lib/
├── auth.ts           # Authentication utilities
├── db.ts             # Database connection
├── scoring.ts        # USS calculation
└── middleware.ts     # API middleware

models/
├── User.ts
├── StudentProfile.ts
├── SkillAssessment.ts
├── JobRole.ts
└── Application.ts
```

## Key Features Implemented

✅ **Authentication**
- JWT-based login/signup
- Role-based access (student/recruiter)

✅ **Student Dashboard**
- View USS score with confidence level
- Score breakdown across categories
- Improvement suggestions
- Edit profile with projects and skills

✅ **Skill Assessments**
- Take skill assessments
- Scores update USS automatically
- See results and review answers

✅ **Recruiter Dashboard**
- Create job roles
- Adjust scoring weights
- View ranked candidates
- Track applications

✅ **USS Scoring System**
- Trust-aware weighting
- Multi-factor evaluation
- Customizable weights per role
- Confidence scoring

## Next Steps

### To Extend the Application

1. **Add AI Assistant**
   - Implement chat interface using OpenAI API
   - Explain scores and suggest improvements

2. **GitHub Integration**
   - Connect GitHub to auto-fetch projects
   - Analyze code quality metrics

3. **Advanced Matching**
   - Implement ML-based matching algorithm
   - Predict best candidates for roles

4. **Analytics Dashboard**
   - Recruiter analytics
   - Hiring funnel visualization
   - Diversity metrics

5. **Mobile App**
   - React Native app
   - Native assessments

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy

```bash
# Or using CLI
npm install -g vercel
vercel
```

## Support & Issues

For issues or questions:
1. Check the README.md
2. Review error messages carefully
3. Check the database connection and `DATABASE_URL`
4. Verify environment variables

---

Happy coding with FairRank! 🚀
