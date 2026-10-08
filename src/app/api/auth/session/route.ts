import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/infrastructure/auth/currentUser';

/**
 * Who is signed in, for the client-side header. Kept out of the cached CMS pages on purpose:
 * reading the cookie there would make every page dynamic. Only the display name leaves the server.
 */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(
    { user: user ? { displayName: user.displayName } : null },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
