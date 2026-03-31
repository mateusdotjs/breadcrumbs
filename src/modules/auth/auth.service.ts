import { clerkClient } from "@clerk/fastify";
import { AuthenticatedUser, ClerkCreateUserBody } from "./auth.types.js";

export class AuthService {
  getAuthenticatedUser(clerkUserId: string | null): AuthenticatedUser | null {
    if (!clerkUserId) return null;
    return { clerkUserId };
  }

  async createClerkUser(payload: ClerkCreateUserBody): Promise<{ clerkUserId: string }> {
    const created = await clerkClient.users.createUser({
      emailAddress: [payload.emailAddress],
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    return { clerkUserId: created.id };
  }
}
