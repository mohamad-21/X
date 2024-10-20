import { getTwittsBySearch } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { getUserDetailsFromAPI } from "@/app/_lib/actions";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import PageHeader from "@/app/_ui/PageHeader";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const generateMetadata = ({ params }: { params: { hashtag: string } }): Metadata => {
  return {
    title: `posts with #${params.hashtag} tag`
  }
}

async function Page({ params }: { params: { hashtag: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Wrapper params={params} />
    </Suspense>
  )
}

async function Wrapper({ params }: { params: { hashtag: string } }) {
  const session = await auth();
  const [twitts, user] = await Promise.all([
    getTwittsBySearch(`#${params.hashtag}`),
    getUserDetailsFromAPI(session!.user.id)
  ]);

  if (!twitts.length) return <h1 className="text-xl font-bold py-3 px-4">Posts with #{params.hashtag} tag was not found</h1>

  return (
    <div>
      <PageHeader title={`Posts With #${params.hashtag} tag`} />
      <TwittsList allTwitts={twitts} user={user} type="without_replies" noRevalidate />
    </div>
  )
}

export default Page;
