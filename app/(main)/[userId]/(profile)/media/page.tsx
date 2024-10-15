import { auth } from "@/app/_lib/auth";
import { getUserByUsername } from "@/app/_lib/actions";
import { getUserTwittsByMedia } from '@/app/_lib/actions';
import { Metadata } from "next";
import TwittsList from "@/app/_ui/TwittsList";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata | void> {
  const user = await getUserByUsername(params.userId);
  if (user) {
    return {
      title: `Media Posts by ${user.name}`
    }
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const [userTwitts, session] = await Promise.all([
    getUserTwittsByMedia(params.userId),
    auth()
  ]);

  return (
    <div className="px-1 py-6">
      {userTwitts.length > 0 ? (
        <TwittsList mediaOnly session={session} allTwitts={userTwitts} />
      ) : (
        <div className="mx-auto max-w-xs">
          <h1 className="text-3xl font-extrabold mb-1">
            {params.userId === session?.user.username ? "You hasn't posted media" : `@${params.userId}hasn't posted media`}
          </h1>
          <p className="text-default-400">
            Once {params.userId === session?.user.username ? "you" : `they`} do, those posts will show up here.
          </p>
        </div>
      )}
    </div>
  )
}

export default Page;
