import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { StudentProfile } from '@/models/StudentProfile';
import { calculateUSS } from '@/lib/scoring';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
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
    await dbConnect();

    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Update profile
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Recalculate USS after update
    const ussData = {
      cgpa: profile.cgpa,
      skills: profile.skills,
      projects: profile.projects,
      experience: profile.experience,
      socialLinks: profile.socialLinks,
    };

    const ussResult = calculateUSS(ussData);

    // Save USS result
    profile.uss = {
      score: ussResult.score,
      confidence: ussResult.confidence,
      breakdown: ussResult.breakdown,
      lastUpdated: new Date(),
    };
    profile.improvementSuggestions = ussResult.suggestions;

    await profile.save();

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error updating student profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
