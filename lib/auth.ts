import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign In with your credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const user = await response.json();

          if (!user) {
            return null;
          }

          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.token = user.token;

        token.is_vendor = user.is_vendor;
        token.is_customer = user.is_customer;
        token.is_superuser = user.is_superuser;
        token.is_pos_staff = user.is_pos_staff;
        token.pos_shop = user.pos_shop;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        first_name: token.first_name,
        last_name: token.last_name,
        email: token.email,
        token: token.token,

        is_vendor: token.is_vendor,
        is_customer: token.is_customer,
        is_superuser: token.is_superuser,
        is_pos_staff: token.is_pos_staff,
        pos_shop: token.pos_shop,
      };

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
};