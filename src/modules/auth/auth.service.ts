import { AuthenticatedUser } from "./auth.types.js";

export class AuthService {
  getAuthenticatedUser(clerkUserId: string | null): AuthenticatedUser | null {
    if (!clerkUserId) return null;
    return { clerkUserId };
  }
}
