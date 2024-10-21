import { getUserById, getUserDetailsFromAPI } from "@/app/_lib/actions";
import { Metadata } from "next";
import TwittsList from "@/app/_ui/TwittsList";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata | void> {
  const user = await getUserById(params.userId);
  if (user) {
    return {
      title: `Media Posts by ${user.name}`
    }
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const user = await getUserDetailsFromAPI(params.userId);

  if (!user) notFound();

  return (
    <div className="px-1 py-6">
      {user.twitts.length > 0 ? (
        <TwittsList mediaOnly userId={user.id} user={user} allTwitts={user.twitts} />
      ) : (
        <div className="mx-auto max-w-xs">
          <h1 className="text-3xl font-extrabold mb-1">
            {params.userId === user.username ? "You hasn't posted media" : `@${params.userId}hasn't posted media`}
          </h1>
          <p className="text-default-400">
            Once {params.userId === user.username ? "you" : `they`} do, those posts will show up here.
          </p>
        </div>
      )}
    </div>
  )
}

export default Page;
