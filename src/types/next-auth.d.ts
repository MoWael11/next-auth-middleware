import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    name: string;
    id: string;
    email: string;
    password: string;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    id: string;
    email: string;
    password: string;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}
