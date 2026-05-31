import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Application } from '@/models/Application';
import { StudentProfile } from '@/models/StudentProfile';
import { JobRole } from '@/models/JobRole';
import { calculateUSSWithCustomWeights } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { roleId, studentId, recruiterId } = body;

    if (!roleId || !studentId || !recruiterId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApp = await Application.findOne({ roleId, studentId });
    if (existingApp) {
      return NextResponse.json(
        { error: 'Already applied' },
        { status: 409 }
      );
    }

    // Get student profile and role
    const studentProfile = await StudentProfile.findById(studentId);
    const role = await JobRole.findById(roleId);

    if (!studentProfile || !role) {
      return NextResponse.json(
        { error: 'Student or role not found' },
        { status: 404 }
      );
    }

    // Calculate score with recruiter's weights
    const ussData = {
      cgpa: studentProfile.cgpa,
      skills: studentProfile.skills,
      projects: studentProfile.projects,
      experience: studentProfile.experience,
      socialLinks: studentProfile.socialLinks,
    };

    const ussResult = calculateUSSWithCustomWeights(ussData, role.weights);

    // Create application
    const application = await Application.create({
      roleId,
      studentId,
      recruiterId,
      score: ussResult.score,
      scoreBreakdown: {
        academics: ussResult.breakdown.academics.score,
        skills: ussResult.breakdown.skills.score,
        projects: ussResult.breakdown.projects.score,
        experience: ussResult.breakdown.experience.score,
        behavioral: ussResult.breakdown.behavioral.score,
      },
    });

    return NextResponse.json({
      success: true,
      data: application,
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
    await dbConnect();

    const roleId = request.nextUrl.searchParams.get('roleId');
    const recruiterId = request.nextUrl.searchParams.get('recruiterId');

    let query: any = {};

    if (roleId) query.roleId = roleId;
    if (recruiterId) query.recruiterId = recruiterId;

    // Get applications and rank them
    let applications = await Application.find(query)
      .populate('studentId')
      .sort({ score: -1 });

    // Add rank
    applications = applications.map((app, index) => ({
      ...app.toObject(),
      rank: index + 1,
    }));

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
