import { getUserBookmarks, getUserDataById } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import PageHeader from "@/app/_ui/PageHeader";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import React, { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("bookmarks"),
  };
}

async function Page() {
  const t = await getTranslations();

  return (
    <div>
      <PageHeader title={t("bookmarks")} />
      <Suspense fallback={<LoadingSpinner />}>
        <Bookmarks />
      </Suspense>
    </div>
  );
}

async function Bookmarks() {
  const session = await auth();
  const [user, twitts, t] = await Promise.all([
    getUserDataById(session!.user.id),
    getUserBookmarks(session!.user.id),
    getTranslations(),
  ]);

  if (twitts.length < 1) {
    return (
      <div className="mx-auto max-w-md px-5 py-10">
        <h1 className="text-4xl mb-1 font-bold">{t("nothingToSeeHere")}</h1>
        <p className="text-default-400">{t("bookmarksNotFoundMessage")}</p>
      </div>
    );
  }

  if (!user) return;

  return (
    <TwittsList isBookmarksList noRevalidate user={user} allTwitts={twitts} />
  );
}

export default Page;
