// User identity management for the NYSC Camp app
// Stores user information consistently across the application

export interface UserIdentity {
  userId: string;
  username: string;
  state: string;
  platoon: string;
}

const USER_IDENTITY_KEY = "nysc_user_identity";

export function getUserIdentity(): UserIdentity | null {
  const stored = localStorage.getItem(USER_IDENTITY_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setUserIdentity(identity: UserIdentity): void {
  localStorage.setItem(USER_IDENTITY_KEY, JSON.stringify(identity));
}

export function clearUserIdentity(): void {
  localStorage.removeItem(USER_IDENTITY_KEY);
}

export function hasUserIdentity(): boolean {
  return getUserIdentity() !== null;
}
