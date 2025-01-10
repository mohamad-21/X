import bcrypt from "bcryptjs";
import { AuthError, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";
import { SessionUser, User, UserFollowingsAndFollowers } from "./definitions";

declare module "next-auth" {
  interface Session {
    user: SessionUser;
    expires: string;
    error: string;
  }
}

class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    // this.type = message;
    this.message = message;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const res = await fetch(
          `${process.env.AUTH_URL}/api/auth/user?email=${credentials.email}`
        );
        if (res.status !== 200)
          throw new CustomAuthError("email or username not found");
        const user: User & { follows: UserFollowingsAndFollowers } =
          await res.json();

        if (!user) throw new CustomAuthError("email or username not found");

        if (credentials?.password) {
          const matchPasswords = await bcrypt.compare(
            <string>credentials.password,
            user.password
          );

          if (!matchPasswords) throw new CustomAuthError("Wrong password!");
        }

        return {
          id: user.id as string,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.profile,
          follows: user.follows,
        };
      },
    }),
  ],
  callbacks: {
    authorized: ({ request, auth }) => {
      if (
        ![
          "/",
          "/i/flow/login",
          "/i/flow/signup",
          "/i/flow/password_reset",
        ].includes(request.nextUrl.pathname) &&
        !auth?.user
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (
        [
          "/",
          "/i/flow/login",
          "/i/flow/signup",
          "/i/flow/password_reset",
        ].includes(request.nextUrl.pathname) &&
        auth?.user
      ) {
        return NextResponse.redirect(new URL("/home", request.url));
      }
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", request.nextUrl.pathname);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    },
    jwt: async ({ token, trigger }) => {
      if (!token.user || trigger === "update") {
        const res = await fetch(
          `${process.env.AUTH_URL}/api/auth/user?email=${token.email}`
        );
        if (res.status !== 200) return token;
        const data: User & { follows: UserFollowingsAndFollowers } =
          await res.json();
        token = {
          ...token,
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            username: data.username,
            image: data.profile,
            follows: data.follows,
          },
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as any;
      return session;
    },
    signIn: async ({ user, credentials }) => {
      const res = await fetch(
        `${process.env.AUTH_URL}/api/auth/user?email=${user.email}`
      );
      if (res.status !== 200) {
        let pass = null;
        if (credentials?.password) {
          pass = bcrypt.hashSync(credentials!.password as string, 10);
        }

        await fetch(
          `${process.env.AUTH_URL}/api/auth/user/create?type=${pass ? "credentials" : "oAuth"
          }`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              password: pass,
            }),
          }
        );
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/api/auth/logout",
  },
};
