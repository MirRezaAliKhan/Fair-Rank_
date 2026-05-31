import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { StudentProfile } from '@/models/StudentProfile';
import { SkillAssessment } from '@/models/SkillAssessment';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { studentId, skillName, questions, score } = body;

    if (!studentId || !skillName || !questions || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create skill assessment
    const assessment = await SkillAssessment.create({
      studentId,
      skillName,
      questions,
      score,
      totalQuestions: questions.length,
      correctAnswers: questions.filter((q: any) => q.correct).length,
      status: 'completed',
    });

    // Update student profile with skill assessment result
    const profile = await StudentProfile.findById(studentId);

    if (profile) {
      const skillIndex = profile.skills.findIndex((s: any) => s.name === skillName);

      if (skillIndex !== -1) {
        profile.skills[skillIndex].assessmentScore = score;
        profile.skills[skillIndex].verified = true;
      } else {
        profile.skills.push({
          name: skillName,
          proficiency: score >= 80 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner',
          verified: true,
          assessmentScore: score,
        });
      }

      await profile.save();
    }

    return NextResponse.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error('Error creating skill assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
