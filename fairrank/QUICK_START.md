# FairRank Quick Start Guide

Get FairRank up and running in 5 minutes!

## 🚀 5-Minute Setup

### 1. Install & Configure
```bash
cd fairrank
npm install
cp .env.example .env.local
```

### 2. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env.local)
```

### 3. Seed Demo Data
```bash
npm run seed
```

### 4. Start the App
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 📝 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `raj@example.com` | `password123` |
| Student | `priya@example.com` | `password123` |
| Student | `arjun@example.com` | `password123` |
| Recruiter | `recruiter@example.com` | `password123` |

---

## 🎮 Quick Walkthrough

### As a Student
1. **Login** with `raj@example.com`
2. View your **USS Score** on dashboard (should be around 75-85)
3. Click **"Edit Profile"** to update your details
4. Go to **"Take Assessment"** to complete a skill test
5. See your score update in real-time!

### As a Recruiter
1. **Login** with `recruiter@example.com`
2. Click **"Create New Role"** to post a job
3. Adjust the **scoring weights** for your role
4. See candidates **ranked instantly**
5. Click **"View Profile"** to see detailed candidate info

---

## 🔑 Key Files to Understand

| File | Purpose |
|------|---------|
| `lib/scoring.ts` | USS calculation engine |
| `models/StudentProfile.ts` | Student data structure |
| `app/dashboard/student/page.tsx` | Student dashboard UI |
| `app/api/students/profile/route.ts` | Profile API endpoint |

---

## 💡 What Can You Do?

✅ Create student profiles with skills, projects, experience
✅ Take skill assessments to verify competencies
✅ Adjust recruiter weights to customize evaluation
✅ See candidates ranked by customized USS
✅ View detailed candidate profiles
✅ Track application statuses

---

## 🛠️ Troubleshooting

**MongoDB won't connect?**
- Ensure MongoDB is running (`mongod` command)
- Check MONGODB_URI in .env.local

**Port 3000 in use?**
- Run: `PORT=3001 npm run dev`

**Can't login after seeding?**
- Refresh the page
- Check that seed script ran successfully
- Try creating a new account

---

## 📚 Learn More

- Full setup guide: [SETUP.md](./SETUP.md)
- Architecture docs: [README.md](./README.md)
- API endpoints: Check `/app/api/` folder

---

## 🎯 Next Steps

After exploring the app:

1. **Customize**: Modify the USS weights and see impacts
2. **Extend**: Add more questions to assessments
3. **Deploy**: Push to Vercel or your hosting
4. **Integrate**: Connect GitHub or LinkedIn APIs
5. **Scale**: Add more features like notifications

---

Happy exploring! 🚀
