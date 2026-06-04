import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { parseJsonFields, stringifyJsonFields } from '@/lib/jsonHelpers';

const roleJsonFields = ['requiredSkills', 'weights', 'filters'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recruiterId, title, description, requiredSkills, weights, filters } = body;

    if (!recruiterId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const role = await prisma.jobRole.create({
      data: stringifyJsonFields(
        {
          recruiterId,
          title,
          description: description || '',
          requiredSkills: requiredSkills || [],
          weights:
            weights ||
            {
              academics: 0.2,
              skills: 0.3,
              projects: 0.25,
              experience: 0.15,
              behavioral: 0.1,
            },
          filters: filters || {},
        },
        roleJsonFields
      ),
    });

    return NextResponse.json({
      success: true,
      data: parseJsonFields(role, roleJsonFields),
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
    const recruiterId = request.nextUrl.searchParams.get('recruiterId');

    if (!recruiterId) {
      return NextResponse.json(
        { error: 'recruiterId is required' },
        { status: 400 }
      );
    }

    const roles = await prisma.jobRole.findMany({
      where: { recruiterId },
    });

    return NextResponse.json({
      success: true,
      data: roles.map((role) => parseJsonFields(role, roleJsonFields)),
    });
  } catch (error) {
    console.error('Error fetching job roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
