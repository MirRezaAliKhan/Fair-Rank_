# FairRank - Beyond CGPA: Smarter, Fairer Placements

A modern, full-stack web application that replaces traditional CGPA-based shortlisting with an adaptive, trust-aware scoring system. FairRank evaluates students based on academics, skills, projects, experience, and behavioral indicators with dynamically adjustable weights.

## 🎯 Key Features

### For Students
- **Universal Standard Score (USS)**: Comprehensive evaluation across 5 dimensions
- **Skill Assessments**: Built-in platform to verify skills and boost your score
- **Profile Management**: Easy-to-use interface to showcase projects, experience, and links
- **Improvement Suggestions**: Personalized recommendations to increase your USS
- **Confidence Indicator**: See how complete and verified your profile is
- **Score Breakdown**: Detailed visualization of each component contributing to your USS

### For Recruiters
- **Adaptive Scoring**: Customize weights for each factor based on role requirements
- **Real-Time Ranking**: Instantly see how candidates rank as you adjust preferences
- **Smart Filtering**: Filter by skills, minimum score, and verified profiles
- **Candidate Insights**: Deep dive into any candidate's full profile and score breakdown
- **Role Management**: Create multiple roles with different weight configurations
- **Application Tracking**: Track and manage candidate applications with custom statuses

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Backend**: Next.js API Routes
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT-based (extendable to Clerk/Firebase)
- **Charts**: Recharts for data visualization
- **State Management**: Zustand (ready for implementation)

### Project Structure
```
fairrank/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── students/          # Student profile & assessments
│   │   ├── recruiters/        # Job roles management
│   │   └── applications/      # Applications & matching
│   ├── components/             # Reusable React components
│   ├── dashboard/             # Dashboard layouts
│   │   ├── student/          # Student dashboard pages
│   │   └── recruiter/        # Recruiter dashboard pages
│   ├── auth/                  # Authentication pages
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── lib/
│   ├── db.ts                  # MongoDB connection
│   ├── auth.ts                # Authentication utilities
│   └── scoring.ts             # USS calculation engine
├── models/
│   ├── User.ts                # User model
│   ├── StudentProfile.ts      # Student data model
│   ├── SkillAssessment.ts    # Assessment model
│   ├── JobRole.ts             # Job role model
│   └── Application.ts         # Application model
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── .env.example               # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd fairrank
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your:
- MongoDB URI
- JWT secret
- API URL

3. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 USS (Universal Standard Score) Algorithm

The USS is calculated as a weighted combination of five components:

### Components
1. **Academics** (Default: 20%)
   - Based on CGPA (0-10 scale)
   - Trust factor: 1.0 if verified, 0.6 if self-reported

2. **Skills** (Default: 30%)
   - Proficiency levels (beginner → expert)
   - Assessment scores (when available)
   - Trust factor: Higher for verified assessments

3. **Projects** (Default: 25%)
   - Number and complexity of projects
   - GitHub verification bonus
   - Tech stack diversity bonus
   - Trust factor: 0.9 for GitHub-verified, 0.6 for self-reported

4. **Experience** (Default: 15%)
   - Number of positions and duration
   - Relevant work history
   - Trust factor: 0.7 (typically from references)

5. **Professional Presence** (Default: 10%)
   - Social profiles (GitHub, LinkedIn, Portfolio)
   - Activity indicators
   - Trust factor: 0.85 with verified profiles, 0.5 without

### Trust Weighting
- **Verified Data**: 1.0 multiplier (from assessments, GitHub, verified certificates)
- **Self-Reported**: 0.6-0.7 multiplier (user input)

### Confidence Score
Combines data completeness with average trust level:
```
Confidence = Data Completeness % × Average Trust × 100
```

## 🎨 UI/UX Highlights

- **Modern Design**: Inspired by Stripe and Notion
- **Smooth Animations**: Fade-in and slide-up transitions
- **Responsive Layout**: Mobile-first, works on all devices
- **Interactive Charts**: Visualize score distributions
- **Real-Time Updates**: Instant feedback on weight adjustments
- **Accessibility**: WCAG 2.1 AA standard compliance (ready)

## 📝 Demo Data

The system includes demo student profiles with contrasting profiles:
- **High CGPA, Low Projects**: Shows how projects boost score
- **Medium CGPA, Strong Projects**: Demonstrates skills-over-grades approach
- **Verified Skills**: Shows assessment score impact
- **Complete Profile**: All fields filled for highest confidence

## 🔐 Security Features

- JWT-based authentication
- Password hashing (bcryptjs)
- Environment variable protection
- Role-based access control
- Input validation and sanitization

## 📈 Future Enhancements

- [ ] AI Chat Assistant for score explanation
- [ ] GitHub integration for project analysis
- [ ] Behavioral analysis from LeetCode/HackerRank
- [ ] Interview scheduling system
- [ ] Analytics dashboard for recruiters
- [ ] Offer management system
- [ ] Mobile app (React Native)
- [ ] Advanced matching algorithm
- [ ] Salary prediction model

## 🧪 Testing

```bash
# Run tests (when configured)
npm run test
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t fairrank .
docker run -p 3000:3000 fairrank
```

## 🤝 Contributing

This is a prototype/demo application showcasing a reimagined placement system.

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support

For questions or issues, please create an issue on GitHub.

---

**FairRank**: Empowering fair, transparent, and intelligent placement evaluation. Beyond CGPA - a smarter approach to finding the right fit.
