import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      token: string;
      is_vendor?: boolean;
      is_customer?: boolean;
      is_superuser?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    token: string;
    is_vendor?: boolean;
    is_customer?: boolean;
    is_superuser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    token: string;
  }
}
