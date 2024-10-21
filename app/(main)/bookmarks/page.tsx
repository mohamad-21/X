import { getUserBookmarks, getUserDetailsFromAPI } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import PageHeader from "@/app/_ui/PageHeader";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Bookmarks"
}

function Page() {
  return (
    <div>
      <PageHeader title="Bookmarks" />
      <Suspense fallback={<LoadingSpinner />}>
        <Bookmarks />
      </Suspense>
    </div>
  )
}

async function Bookmarks() {
  const session = await auth();
  const [user, twitts] = await Promise.all([
    getUserDetailsFromAPI(session!.user.id),
    getUserBookmarks(session!.user.id)
  ]);

  if (twitts.length < 1) {
    return (
      <div className="mx-auto max-w-md px-5 py-10">
        <h1 className="text-4xl mb-1 font-bold">Nothing to see here yet</h1>
        <p className="text-default-400">When bookmark a post, you&apos;ll find it here.</p>
      </div>
    )
  }

  return (
    <TwittsList isBookmarksList noRevalidate user={user} allTwitts={twitts} />
  )
}

export default Page;
