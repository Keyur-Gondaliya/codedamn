import User from "@/models/user";
import { tokenForUser } from "@/utils/AccessFunction";
import { connectToDB } from "@/config/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();

        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser && sessionUser._id) {
          session.user.id = sessionUser._id.toString();
          session.user.token = tokenForUser(sessionUser);
        }
      } catch (error) {}

      return session;
    },
    async signIn({ profile }: any) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: profile.email });
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log("---", error);
        return false;
      }
    },
  },
});

export const GET = handler;
export const POST = handler;
