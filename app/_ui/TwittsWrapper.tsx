import { Session } from "next-auth";
import { Suspense } from "react";
import { getAlltwitts } from "@/app/_lib/actions";
import CreatePost from "@/app/_ui/createPost/CreatePost";
import LoadingSpinner from "./LoadingSpinner";
import TwittsList from "./TwittsList";

async function TwittsWrapper({ session }: { session: Session }) {
  return (
    <div className="sm:min-h-[98dvh] overflow-hidden w-full sm:mb-0 mb-11">
      <div className="sm:block hidden border-b border-default">
        <CreatePost user={session.user!} />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <Twitts session={session} />
      </Suspense>
    </div>
  )
}

async function Twitts({ session }: { session: Session | null }) {
  const allTwitts = await getAlltwitts();

  return (
    <TwittsList
      session={session}
      allTwitts={allTwitts}
    />
  )
}

export default TwittsWrapper;
