export type AuthenticatedUser = {
  clerkUserId: string;
};

export type ClerkCreateUserBody = {
  emailAddress: string;
  password: string;
  firstName?: string;
  lastName?: string;
};
