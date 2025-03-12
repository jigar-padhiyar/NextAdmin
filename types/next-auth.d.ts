import 'next-auth';
import { DefaultSession } from 'next-auth';

// Extend the built-in session types
declare module 'next-auth' {
  interface User {
    id: string;
    role?: string;
    provider?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      provider: string;
    } & DefaultSession["user"];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    provider: string;
  }
}