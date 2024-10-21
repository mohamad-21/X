import React from "react";
import { getUserById, getUserFollowersAndFollowings } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import UserProfile from "./UserProfile";
import { notFound } from "next/navigation";

async function Layout({ children, modal, params }: { children: React.ReactNode, modal: React.ReactNode, params: { userId: string } }) {
  const [session, user] = await Promise.all([
    auth(),
    getUserById(params.userId),
  ]);
  if (!user) notFound();

  const follows = await getUserFollowersAndFollowings(user.id);

  return (
    <div className="flex-1">
      <UserProfile user={user} headerSubtitle={`${user.twitts.length} post${user.twitts.length! > 0 ? 's' : ''}`} follows={follows} sessionUser={session?.user!} />
      {modal}
      {children}
    </div>
  )
}

export default Layout;
