import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { calculateUSSWithCustomWeights } from '@/lib/scoring';
import { parseJsonFields } from '@/lib/jsonHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleId, studentId, recruiterId } = body;

    if (!roleId || !studentId || !recruiterId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingApp = await prisma.application.findFirst({
      where: { roleId, studentId },
    });
    if (existingApp) {
      return NextResponse.json(
        { error: 'Already applied' },
        { status: 409 }
      );
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });
    const role = await prisma.jobRole.findUnique({
      where: { id: roleId },
    });

    if (!studentProfile || !role) {
      return NextResponse.json(
        { error: 'Student or role not found' },
        { status: 404 }
      );
    }

    const parsedStudentProfile = parseJsonFields(studentProfile, [
      'cgpa',
      'skills',
      'projects',
      'experience',
      'socialLinks',
    ]) as any;
    const parsedRole = parseJsonFields(role, ['weights']) as any;

    const ussData = {
      cgpa: parsedStudentProfile.cgpa,
      skills: parsedStudentProfile.skills,
      projects: parsedStudentProfile.projects,
      experience: parsedStudentProfile.experience,
      socialLinks: parsedStudentProfile.socialLinks,
    };

    const ussResult = calculateUSSWithCustomWeights(ussData, parsedRole.weights);

    const application = await prisma.application.create({
      data: {
        roleId,
        studentId,
        recruiterId,
        score: ussResult.score,
        scoreBreakdown: JSON.stringify({
          academics: ussResult.breakdown.academics.score,
          skills: ussResult.breakdown.skills.score,
          projects: ussResult.breakdown.projects.score,
          experience: ussResult.breakdown.experience.score,
          behavioral: ussResult.breakdown.behavioral.score,
        }),
        status: 'applied',
        appliedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: parseJsonFields(application, ['scoreBreakdown']),
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const roleId = request.nextUrl.searchParams.get('roleId');
    const recruiterId = request.nextUrl.searchParams.get('recruiterId');

    const where: any = {};
    if (roleId) where.roleId = roleId;
    if (recruiterId) where.recruiterId = recruiterId;

    const applications = await prisma.application.findMany({
      where,
      include: { student: true },
      orderBy: { score: 'desc' },
    });

    const rankedApplications = applications.map((app, index) => ({
      ...app,
      scoreBreakdown: JSON.parse(app.scoreBreakdown || '{}'),
      student: parseJsonFields(app.student, [
        'cgpa',
        'skills',
        'projects',
        'experience',
        'education',
        'socialLinks',
        'uss',
        'improvementSuggestions',
      ]),
      rank: index + 1,
    }));

    return NextResponse.json({
      success: true,
      data: rankedApplications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
