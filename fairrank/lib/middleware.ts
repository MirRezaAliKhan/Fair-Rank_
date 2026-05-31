/**
 * Middleware for authenticating API requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  return null; // Allow request to proceed
}
