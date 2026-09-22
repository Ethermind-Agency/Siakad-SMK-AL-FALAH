import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Profile, UserRole } from '@/lib/types/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
  profile: Profile;
}

/**
 * Retrieves the currently authenticated user with their associated profile and role.
 * Returns null if the user is unauthenticated or has no profile.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    const typedProfile = profile as Profile;

    return {
      id: user.id,
      email: user.email ?? typedProfile.email,
      profile: typedProfile,
    };
  } catch (error) {
    console.error('Error fetching authenticated user:', error);
    return null;
  }
}

/**
 * Checks if the current user has one of the allowed roles.
 */
export function hasRequiredRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}
