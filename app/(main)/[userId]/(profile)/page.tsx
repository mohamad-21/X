import { getUserById, getUserDetailsFromAPI } from "@/app/_lib/actions";
import { UserData } from "@/app/_lib/definitions";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
  const user = await getUserById(params.userId);
  return {
    title: user ? `${user.name} (@${user.username})` : "Profile"
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const user: UserData = await getUserDetailsFromAPI(params.userId);
  if (!user) notFound();

  return (
    <TwittsList user={user} allTwitts={user.twitts} userId={user.id} type="without_replies" />
  )
}

export default Page;
