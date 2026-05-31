import mongoose from 'mongoose';

const JobRoleSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    requiredSkills: [String],
    minUSSScore: {
      type: Number,
      default: 0,
    },
    weights: {
      academics: {
        type: Number,
        default: 0.2,
        min: 0,
        max: 1,
      },
      skills: {
        type: Number,
        default: 0.3,
        min: 0,
        max: 1,
      },
      projects: {
        type: Number,
        default: 0.25,
        min: 0,
        max: 1,
      },
      experience: {
        type: Number,
        default: 0.15,
        min: 0,
        max: 1,
      },
      behavioral: {
        type: Number,
        default: 0.1,
        min: 0,
        max: 1,
      },
    },
    filters: {
      verifiedOnly: Boolean,
      minCGPA: Number,
      skills: [String],
    },
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

export const JobRole =
  mongoose.models.JobRole || mongoose.model('JobRole', JobRoleSchema);
