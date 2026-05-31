import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { JobRole } from '@/models/JobRole';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { recruiterId, title, description, requiredSkills, weights, filters } = body;

    if (!recruiterId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const role = await JobRole.create({
      recruiterId,
      title,
      description: description || '',
      requiredSkills: requiredSkills || [],
      weights: weights || {
        academics: 0.2,
        skills: 0.3,
        projects: 0.25,
        experience: 0.15,
        behavioral: 0.1,
      },
      filters: filters || {},
    });

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Error creating job role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const recruiterId = request.nextUrl.searchParams.get('recruiterId');

    if (!recruiterId) {
      return NextResponse.json(
        { error: 'recruiterId is required' },
        { status: 400 }
      );
    }

    const roles = await JobRole.find({ recruiterId });

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error('Error fetching job roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
