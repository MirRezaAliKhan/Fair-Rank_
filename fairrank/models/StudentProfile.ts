import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    cgpa: {
      value: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    skills: [
      {
        name: String,
        proficiency: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
        verified: Boolean,
        assessmentScore: Number,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        githubLink: String,
        liveLink: String,
        startDate: Date,
        endDate: Date,
        highlights: [String],
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
        skills: [String],
      },
    ],
    education: {
      institution: String,
      branch: String,
      graduationYear: Number,
    },
    socialLinks: {
      github: String,
      linkedin: String,
      portfolio: String,
    },
    uss: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      breakdown: {
        academics: {
          score: Number,
          weight: Number,
        },
        skills: {
          score: Number,
          weight: Number,
        },
        projects: {
          score: Number,
          weight: Number,
        },
        experience: {
          score: Number,
          weight: Number,
        },
        behavioral: {
          score: Number,
          weight: Number,
        },
      },
      lastUpdated: Date,
    },
    improvementSuggestions: [
      {
        category: String,
        suggestion: String,
        potentialImpact: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const StudentProfile =
  mongoose.models.StudentProfile ||
  mongoose.model('StudentProfile', StudentProfileSchema);
