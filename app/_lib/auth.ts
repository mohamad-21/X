import NextAuth from "next-auth";
import { authConfig } from "./authConfig";

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig
});