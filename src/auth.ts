import { getDb } from "@/lib/mongodb";
import { createUserSession } from "@/lib/session";
import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import TwitterProvider from "next-auth/providers/twitter";

// Allow a few explicit anys in auth wiring because provider typings vary across adapters.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async redirect() {
      // After provider sign-in, always send the user to the homepage
      return "/";
    },
    async signIn({ user, account, profile }: any) {
      try {
        // Upsert user into existing users collection so social and manual users share same DB
        const db = await getDb();
        const users = db.collection("users");
        const email = (user?.email || profile?.email || "").toLowerCase();
        const name =
          user?.name ||
          profile?.name ||
          profile?.login ||
          profile?.given_name ||
          "";
        if (!email) {
          // cannot create user without email; deny sign-in
          return false;
        }

        const now = new Date();
        const update = {
          $set: {
            email,
            name,
            provider: account?.provider || null,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        } as any;

        const dbUser = await users.findOneAndUpdate({ email }, update, {
          upsert: true,
          returnDocument: "after",
        });

        if (dbUser) {
          // set the same cookie-based session used by manual flows
          await createUserSession({
            _id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
            isApproved: dbUser.isApproved,
            approvalStatus: dbUser.approvalStatus,
            isRootUser: dbUser.isRootUser,
          });
        }

        return true;
      } catch {
        // If anything goes wrong, deny sign-in
        return false;
      }
    },
    async jwt({ token, account, user }: any) {
      if (account) {
        (token as any).accessToken =
          (account as any).access_token || (account as any).oauth_token;
      }
      if (user) {
        (token as any).id = (user as any).id || (user as any).sub;
      }
      return token;
    },
    async session({ session, token }: any) {
      (session as any).accessToken = (token as any).accessToken;
      (session.user as any).id = (token as any).id;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
