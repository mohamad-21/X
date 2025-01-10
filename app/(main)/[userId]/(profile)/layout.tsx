import { getUserDataById, getUserDetailsById } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { notFound } from "next/navigation";
import React from "react";
import UserProfile from "./UserProfile";
import { getTranslations } from "next-intl/server";

async function Layout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { userId: string };
}) {
  const session = await auth();
  const [sessionUser, user, t] = await Promise.all([
    getUserDetailsById(session!.user.id),
    getUserDataById(decodeURIComponent(params.userId)),
    getTranslations(),
  ]);

  if (!user || !sessionUser) notFound();

  return (
    <div className="flex-1">
      <UserProfile
        user={user}
        headerSubtitle={`${user.twitts.length} ${t("postsCount")}`}
        follows={user.follows}
        sessionUser={sessionUser}
      />
      {modal}
      {children}
    </div>
  );
}

export default Layout;
