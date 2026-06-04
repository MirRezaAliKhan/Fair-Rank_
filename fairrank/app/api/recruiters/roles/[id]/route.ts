import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { parseJsonFields, stringifyJsonFields } from '@/lib/jsonHelpers';

const roleJsonFields = ['requiredSkills', 'weights', 'filters'];

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id } = await context.params;

    const updatedRole = await prisma.jobRole.update({
      where: { id },
      data: stringifyJsonFields(body, roleJsonFields),
    });

    if (!updatedRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parseJsonFields(updatedRole, roleJsonFields),
    });
  } catch (error) {
    console.error('Error updating job role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
