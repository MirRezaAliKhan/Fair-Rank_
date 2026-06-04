import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { stringifyJsonFields } from '@/lib/jsonHelpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['student', 'recruiter'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    if (role === 'student') {
      await prisma.studentProfile.create({
        data: stringifyJsonFields(
          {
            userId: user.id,
            cgpa: { value: 0, verified: false },
            skills: [],
            projects: [],
            experience: [],
            education: {},
            socialLinks: {},
            uss: {
              score: 0,
              confidence: 0,
              breakdown: {
                academics: { score: 0, weight: 0.2 },
                skills: { score: 0, weight: 0.3 },
                projects: { score: 0, weight: 0.25 },
                experience: { score: 0, weight: 0.15 },
                behavioral: { score: 0, weight: 0.1 },
              },
              lastUpdated: new Date(),
            },
            improvementSuggestions: [],
          },
          [
            'cgpa',
            'skills',
            'projects',
            'experience',
            'education',
            'socialLinks',
            'uss',
            'improvementSuggestions',
          ]
        ),
      });
    }

    const token = generateToken(user.id, role);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
