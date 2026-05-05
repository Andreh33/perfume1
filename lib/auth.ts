import "server-only";
import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "STAFF" | "ADMIN";
      locale: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "CUSTOMER" | "STAFF" | "ADMIN";
    locale?: string;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/cuenta/iniciar-sesion",
    verifyRequest: "/cuenta/verificar",
    error: "/cuenta/error",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user?.passwordHash || user.deletedAt) return null;
        const valid = await argon2.verify(user.passwordHash, password);
        if (!valid) return null;
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          locale: user.locale,
        };
      },
    }),
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: "CUSTOMER" | "STAFF" | "ADMIN" }).role ?? "CUSTOMER";
        token.locale = (user as { locale?: string }).locale ?? "es";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "CUSTOMER" | "STAFF" | "ADMIN") ?? "CUSTOMER";
        session.user.locale = (token.locale as string) ?? "es";
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin")) {
        return session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";
      }
      if (pathname.startsWith("/cuenta") && pathname !== "/cuenta/iniciar-sesion") {
        return !!session?.user;
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        await prisma.wishlist.create({ data: { userId: user.id } }).catch(() => undefined);
      }
    },
  },
});
