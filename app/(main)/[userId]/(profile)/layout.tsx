import { getUserDetailsFromAPI } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { notFound } from "next/navigation";
import React from "react";
import UserProfile from "./UserProfile";

async function Layout({ children, modal, params }: { children: React.ReactNode, modal: React.ReactNode, params: { userId: string } }) {
  const session = await auth();
  const [sessionUser, user] = await Promise.all([
    getUserDetailsFromAPI(session!.user.id, { onlyDetails: true }),
    getUserDetailsFromAPI(params.userId),
  ]);

  if (!user) notFound();

  return (
    <div className="flex-1">
      <UserProfile user={user} headerSubtitle={`${user.twitts.length} post${user.twitts.length! > 0 ? 's' : ''}`} follows={user.follows} sessionUser={sessionUser} />
      {modal}
      {children}
    </div>
  )
}

export default Layout;
