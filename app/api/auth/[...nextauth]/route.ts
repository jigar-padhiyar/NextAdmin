import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import type { NextAuthOptions } from 'next-auth';
import { findOrCreateUser, users } from '@/lib/user';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'user'
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Check if credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For demo admin user
        if (
          credentials.email === 'admin@example.com' &&
          credentials.password === 'password123'
        ) {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            image: '/images/avatar-placeholder.png',
          };
        }

        // Check if user exists in our "database"
        const user = users.find(user => user.email === credentials.email);
        
        // If user exists and password matches
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            image: user.image,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For GitHub authentication, integrate with our user store
      if (account?.provider === 'github' && profile) {
        const oauthUser = findOrCreateUser(profile, 'github');
        // Update the user object with our stored data
        user.id = oauthUser.id;
        user.role = oauthUser.role;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.role = user.role || 'user';
        token.id = user.id;
        token.provider = account?.provider || 'credentials';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

// Create and export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };