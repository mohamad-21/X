import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import React, { Suspense } from "react";
import SearchHeader from "./SearchHeader";
import {
  getPeopleAndTwittsBySearch,
  getUserDataById,
  getWhoToFollowSuggestings,
} from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import People from "@/app/_ui/People";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: searchParams?.q
      ? t("searchFor", { searchTerm: searchParams.q })
      : t("searchPeopleAndPosts"),
  };
}

function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const searchTerm = searchParams?.q;

  return (
    <div>
      <SearchHeader />
      <Suspense fallback={<LoadingSpinner key={searchTerm} />}>
        <SearchResultWrapper searchTerm={searchTerm} />
      </Suspense>
    </div>
  );
}

async function SearchResultWrapper({ searchTerm }: { searchTerm?: string }) {
  const session = await auth();
  const t = await getTranslations();
  if (searchTerm) {
    const [user, peopleAndTwitts, whoToFollowSuggestings] = await Promise.all([
      getUserDataById(session!.user.id),
      getPeopleAndTwittsBySearch(searchTerm),
      getWhoToFollowSuggestings(session!.user.id),
    ]);

    if (!user) return;

    if (
      peopleAndTwitts.people.length < 1 &&
      peopleAndTwitts.twitts.length < 1
    ) {
      return (
        <div className="mx-auto px-5 py-10">
          <h1 className="text-4xl mb-1 font-bold">
            {t("noSearchResultsFoundedMessage", { searchTerm })}
          </h1>
          <p className="text-default-400">{t("trySearchingSomethingElse")}</p>
        </div>
      );
    }

    return (
      <div className="mt-3">
        {peopleAndTwitts.people.length > 0 && (
          <div className="border-y border-y-default">
            <People
              people={peopleAndTwitts.people}
              user={user}
              title={t("people")}
            />
          </div>
        )}
        {peopleAndTwitts.twitts.length > 0 && (
          <TwittsList
            allTwitts={peopleAndTwitts.twitts}
            user={user}
            noRevalidate
          />
        )}
        {whoToFollowSuggestings.length > 0 && (
          <div className="pt-5">
            <People
              people={whoToFollowSuggestings}
              user={user}
              title={t("whoToFollow")}
            />
          </div>
        )}
      </div>
    );
  }

  const [user, whoToFollowSuggestings] = await Promise.all([
    getUserDataById(session!.user.id),
    getWhoToFollowSuggestings(session!.user.id),
  ]);

  if (!user) return;

  return (
    <>
      {whoToFollowSuggestings.length > 0 && (
        <div className="pt-5">
          <People
            people={whoToFollowSuggestings}
            user={user}
            title={t("whoToFollow")}
          />
        </div>
      )}
    </>
  );
}

export default Page;
