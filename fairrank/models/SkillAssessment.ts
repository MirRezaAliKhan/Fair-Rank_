import mongoose from 'mongoose';

const SkillAssessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        userAnswer: Number,
        correct: Boolean,
      },
    ],
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    totalQuestions: Number,
    correctAnswers: Number,
    duration: Number, // in seconds
    completedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
  },
  { timestamps: true }
);

export const SkillAssessment =
  mongoose.models.SkillAssessment ||
  mongoose.model('SkillAssessment', SkillAssessmentSchema);
