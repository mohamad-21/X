import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import React, { Suspense } from "react";
import SearchHeader from "./SearchHeader";
import { getPeopleAndTwittsBySearch, getUserDetailsFromAPI } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import People from "@/app/_ui/People";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";

export function generateMetadata({ searchParams }: { searchParams?: { [key: string]: string } }): Metadata {
  return {
    title: searchParams?.q ? `Search for "${searchParams?.q}"` : "Search people and posts"
  }
}

function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const searchTerm = searchParams?.q;

  return (
    <div>
      <SearchHeader />
      {searchTerm && (
        <Suspense fallback={<LoadingSpinner key={searchTerm} />}>
          <SearchWrapper searchTerm={searchTerm} />
        </Suspense>
      )}
    </div>
  )
}

async function SearchWrapper({ searchTerm }: { searchTerm: string }) {
  const session = await auth();
  const [user, peopleAndTwitts] = await Promise.all([
    getUserDetailsFromAPI(session!.user.id),
    getPeopleAndTwittsBySearch(searchTerm),
  ]);

  if (peopleAndTwitts.people.length < 1 && peopleAndTwitts.twitts.length < 1) {
    return (
      <div className="mx-auto px-5 py-10">
        <h1 className="text-4xl mb-1 font-bold">No results for &apos;&apos;{searchTerm}&apos;&apos;</h1>
        <p className="text-default-400">Try searching for something else.</p>
      </div>
    )
  }

  return (
    <div className="mt-3">
      {peopleAndTwitts.people.length > 0 && (
        <div className="border-y border-y-default">
          <People people={peopleAndTwitts.people} user={user} />
        </div>
      )}
      {peopleAndTwitts.twitts.length > 0 && (
        <TwittsList allTwitts={peopleAndTwitts.twitts} user={user} noRevalidate />
      )}
    </div>
  )
}

export default Page;
