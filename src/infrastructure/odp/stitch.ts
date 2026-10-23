import { cookies } from 'next/headers';
import type { UserRecord } from '@/infrastructure/auth/userStore';
import { nowSeconds, sendOdpEvents, type OdpResult } from './tracker';
import { VUID_COOKIE_NAME, normalizeVuid } from './vuid';

/**
 * Identity stitch: tells ODP that this browser's anonymous `vuid` belongs to the member's email,
 * so the pre-login history merges into the member profile. Runs on the server: the email comes
 * from the user store and never reaches the browser. Returns null when there is nothing to stitch
 * (no email on the member, or the visitor has no vuid cookie yet).
 */
export async function stitchVisitorToMember(user: UserRecord): Promise<OdpResult | null> {
  if (!user.email) return null;

  const cookieStore = await cookies();
  const vuid = normalizeVuid(cookieStore.get(VUID_COOKIE_NAME)?.value);
  if (!vuid) return null;

  return sendOdpEvents([
    {
      type: 'customer',
      action: 'login',
      identifiers: { vuid, email: user.email },
      data: { ts: nowSeconds(), channel: 'online_banking' },
    },
  ]);
}
