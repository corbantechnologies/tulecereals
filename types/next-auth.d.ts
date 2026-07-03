import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    token: string;
    is_vendor?: boolean;
    is_customer?: boolean;
    is_superuser?: boolean;
    is_pos_staff?: boolean;
    pos_shop?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    token: string;
    is_vendor?: boolean;
    is_customer?: boolean;
    is_superuser?: boolean;
    is_pos_staff?: boolean;
    pos_shop?: string;
  }
}