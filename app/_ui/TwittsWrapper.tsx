import { getAlltwitts } from "@/app/_lib/actions";
import CreatePost from "@/app/_ui/createPost/CreatePost";
import { Suspense } from "react";
import { UserWithFollows } from "@/app/_lib/definitions";
import LoadingSpinner from "./LoadingSpinner";
import TwittsList from "./TwittsList";

async function TwittsWrapper({ user }: { user: UserWithFollows }) {
  return (
    <div className="sm:min-h-[98dvh] overflow-hidden w-full sm:mb-0 mb-11">
      <div className="sm:block hidden border-b border-default">
        <CreatePost user={user} />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <Twitts user={user} />
      </Suspense>
    </div>
  )
}

async function Twitts({ user }: { user: UserWithFollows }) {
  const allTwitts = await getAlltwitts();
  return (
    <TwittsList
      user={user}
      allTwitts={allTwitts}
    />
  )
}

export default TwittsWrapper;
