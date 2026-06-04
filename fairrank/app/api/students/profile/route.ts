import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { calculateUSS } from '@/lib/scoring';
import { parseJsonFields, stringifyJsonFields } from '@/lib/jsonHelpers';

const profileJsonFields = [
  'cgpa',
  'skills',
  'projects',
  'experience',
  'education',
  'socialLinks',
  'uss',
  'improvementSuggestions',
];

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parseJsonFields(profile, profileJsonFields),
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const serializedUpdate = stringifyJsonFields(updateData, profileJsonFields);

    const profile = await prisma.studentProfile.update({
      where: { userId },
      data: serializedUpdate,
    });

    const parsedProfile = parseJsonFields(profile, profileJsonFields);

    const ussData = {
      cgpa: parsedProfile.cgpa,
      skills: parsedProfile.skills,
      projects: parsedProfile.projects,
      experience: parsedProfile.experience,
      socialLinks: parsedProfile.socialLinks,
    };

    const ussResult = calculateUSS(ussData);

    const updatedProfile = await prisma.studentProfile.update({
      where: { id: profile.id },
      data: stringifyJsonFields(
        {
          uss: {
            score: ussResult.score,
            confidence: ussResult.confidence,
            breakdown: ussResult.breakdown,
            lastUpdated: new Date(),
          },
          improvementSuggestions: ussResult.suggestions,
        },
        ['uss', 'improvementSuggestions']
      ),
    });

    return NextResponse.json({
      success: true,
      data: parseJsonFields(updatedProfile, profileJsonFields),
    });
  } catch (error) {
    console.error('Error updating student profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
