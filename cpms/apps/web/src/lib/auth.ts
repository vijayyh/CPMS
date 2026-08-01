import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("User not registered in the system.");
        }

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
          assignedProjectId: user.assignedProjectId,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role;
        token.assignedProjectId = (user as any).assignedProjectId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id   = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).assignedProjectId = token.assignedProjectId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET || "cpms-super-secret-key-2024",
});
