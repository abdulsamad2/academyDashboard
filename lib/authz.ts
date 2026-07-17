import { auth } from '@/auth';
import { db } from '@/db/db';

type ActiveTutorResult =
  | { ok: true; userId: string; isAdmin: boolean }
  | { ok: false; error: string };

/**
 * Server-action guard: caller must be a signed-in tutor whose account
 * has been approved (status !== pendingApproval/disabled), or an admin.
 * Status is read from the DB, not the JWT, so admin approval/disable
 * takes effect immediately instead of after token expiry.
 */
export async function requireActiveTutor(): Promise<ActiveTutorResult> {
  const session = await auth();
  //@ts-ignore
  const userId: string | undefined = session?.id;
  //@ts-ignore
  const role: string | undefined = session?.role;

  if (!userId) {
    return { ok: false, error: 'You must be logged in.' };
  }
  if (role === 'admin') {
    return { ok: true, userId, isAdmin: true };
  }
  if (role !== 'tutor') {
    return { ok: false, error: 'Only tutors can perform this action.' };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { status: true }
  });
  if (user?.status === 'pendingApproval') {
    return { ok: false, error: 'Your account is awaiting admin approval.' };
  }
  if (user?.status === 'disabled') {
    return { ok: false, error: 'Your account has been disabled.' };
  }

  return { ok: true, userId, isAdmin: false };
}

type AuthResult =
  | { ok: true; userId: string; role: string }
  | { ok: false; error: string };

/** Server-action guard: caller must be signed in. Returns their id + role. */
export async function requireUser(): Promise<AuthResult> {
  const session = await auth();
  //@ts-ignore
  const userId: string | undefined = session?.id;
  //@ts-ignore
  const role: string | undefined = session?.role;
  if (!userId) return { ok: false, error: 'You must be logged in.' };
  return { ok: true, userId, role: role ?? 'parent' };
}

/** Server-action guard: caller must be an admin. */
export async function requireAdmin(): Promise<AuthResult> {
  const res = await requireUser();
  if (!res.ok) return res;
  if (res.role !== 'admin') {
    return { ok: false, error: 'Admin access required.' };
  }
  return res;
}
