import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { parseJsonFields, stringifyJsonFields } from '@/lib/jsonHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, skillName, questions, score } = body;

    if (!studentId || !skillName || !questions || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const assessment = await prisma.skillAssessment.create({
      data: {
        studentId,
        skillName,
        questions: stringifyJsonFields({ questions }, ['questions']).questions,
        score,
        totalQuestions: questions.length,
        correctAnswers: questions.filter((q: any) => q.correct).length,
        status: 'completed',
        completedAt: new Date(),
      },
    });

    const profile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (profile) {
      const parsedProfile = parseJsonFields(profile, ['skills']);
      const skills = Array.isArray(parsedProfile.skills) ? [...parsedProfile.skills] : [];
      const skillIndex = skills.findIndex((s: any) => s.name === skillName);

      if (skillIndex !== -1) {
        skills[skillIndex] = {
          ...skills[skillIndex],
          assessmentScore: score,
          verified: true,
        };
      } else {
        skills.push({
          name: skillName,
          proficiency: score >= 80 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner',
          verified: true,
          assessmentScore: score,
        });
      }

      await prisma.studentProfile.update({
        where: { id: studentId },
        data: {
          skills: JSON.stringify(skills),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: parseJsonFields(assessment, ['questions']),
    });
  } catch (error) {
    console.error('Error creating skill assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
