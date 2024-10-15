import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/app/_lib/actions";
import TwittsList from "@/app/_ui/TwittsList";
import { auth } from "@/app/_lib/auth";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata | void> {
  const user = await getUserByUsername(params.userId);
  if (user) {
    return {
      title: `Posts with replies by ${user.name}`
    }
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const [user, session] = await Promise.all([
    getUserByUsername(params.userId, true),
    auth()
  ]);

  if (!user) notFound();

  return (
    <TwittsList
      session={session}
      allTwitts={user.twitts}
      userId={user.id}
      type="with_replies"
    />
  )
}

export default Page;
