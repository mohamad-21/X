import { getTwittsBySearch } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { getUserDataById } from "@/app/_lib/actions";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import PageHeader from "@/app/_ui/PageHeader";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async ({
  params,
}: {
  params: { hashtag: string };
}): Promise<Metadata> => {
  const t = await getTranslations();
  return {
    title: t("postsWithTagBrowserTitle", { tag: params.hashtag }),
  };
};

async function Page({ params }: { params: { hashtag: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Wrapper params={params} />
    </Suspense>
  );
}

async function Wrapper({ params }: { params: { hashtag: string } }) {
  const session = await auth();
  const hashtag = decodeURIComponent(params.hashtag);
  const [twitts, user, t] = await Promise.all([
    getTwittsBySearch(hashtag),
    getUserDataById(session!.user.id),
    getTranslations(),
  ]);

  if (!twitts.length)
    return (
      <h1 className="text-xl font-bold py-3 px-4">
        {t("postsWithTagNotFound", { tag: hashtag })}
      </h1>
    );
  if (!user) return;

  return (
    <div>
      <PageHeader title={t("postsWithTag", { tag: hashtag })} />
      <TwittsList
        allTwitts={twitts}
        user={user}
        type="without_replies"
        noRevalidate
      />
    </div>
  );
}

export default Page;
