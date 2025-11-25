import NextAuth, { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { loginRateLimit } from "@/lib/rate-limit"

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Rate limiting for login attempts
        if (loginRateLimit) {
          const identifier = credentials.username as string;
          const { success } = await loginRateLimit.limit(identifier);
          
          if (!success) {
            throw new Error("Terlalu banyak percobaan login. Coba lagi dalam 15 menit.");
          }
        }

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username as string }
        })

        if (!admin || !admin.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          admin.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: admin.id,
          name: admin.username,
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export const { GET, POST } = handlers
