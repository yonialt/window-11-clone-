// Admin authentication helper for the UAC gate.
//
// The gate is intentionally one-shot: every Add/Edit/Delete action requires a
// fresh username + password check against the backend, and no session state is
// persisted to localStorage or React state afterwards.

const AUTH_URL = '/api/auth/admin';

/**
 * Validates the administrator username + password against the backend endpoint
 * for a single action. Returns success only — nothing is stored.
 */
export const authenticateAdmin = async (
  username: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return { success: true };
    }
    return {
      success: false,
      message: typeof data.message === 'string' ? data.message : 'Incorrect credentials',
    };
  } catch {
    return { success: false, message: 'Unable to reach the authentication server.' };
  }
};
