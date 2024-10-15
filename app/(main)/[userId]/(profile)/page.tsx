import { auth } from "@/app/_lib/auth";
import { getUserByUsername } from "@/app/_lib/actions";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
  const user = await getUserByUsername(params.userId);
  return {
    title: user ? `${user.name} (@${user.username})` : "Profile"
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const [user, session] = await Promise.all([
    getUserByUsername(params.userId),
    auth()
  ]);
  if (!user) notFound();

  return (
    <TwittsList session={session} allTwitts={user.twitts} userId={user.id} type="without_replies" />
  )
}

export default Page;
