import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { JobRole } from '@/models/JobRole';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id } = params;

    const updatedRole = await JobRole.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRole,
    });
  } catch (error) {
    console.error('Error updating job role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
