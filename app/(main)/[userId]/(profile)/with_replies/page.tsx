import { getUserById, getUserDetailsFromAPI } from "@/app/_lib/actions";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata | void> {
  const user = await getUserById(params.userId);
  if (user) {
    return {
      title: `Posts with replies by ${user.name}`
    }
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const user = await getUserDetailsFromAPI(params.userId, { twittsWithReply: true });
  if (!user) notFound();

  return (
    <TwittsList user={user} allTwitts={user.twitts} userId={user.id} type="with_replies" />
  )
}

export default Page;
