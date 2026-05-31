import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRole',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      academics: Number,
      skills: Number,
      projects: Number,
      experience: Number,
      behavioral: Number,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'selected'],
      default: 'applied',
    },
    rank: Number,
    appliedAt: {
      type: Date,
      default: Date.now,
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

export const Application =
  mongoose.models.Application ||
  mongoose.model('Application', ApplicationSchema);
