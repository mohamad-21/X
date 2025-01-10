import { getUserDataById, getUserDetailsById } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  const [user, t] = await Promise.all([
    getUserDetailsById(decodeURIComponent(params.userId)),
    getTranslations(),
  ]);
  return {
    title: user ? `${user.name} (@${user.username})` : t("profile"),
  };
}

async function Page({ params }: { params: { userId: string } }) {
  const session = await auth();
  if (!session?.user) return redirect("/");
  const sessionUser = await getUserDataById(session.user.id)
  const userPage = await getUserDataById(decodeURIComponent(params.userId), { includeRetwitts: sessionUser?.username === params.userId });
  if (!userPage || !sessionUser) notFound();

  return (
    <TwittsList
      user={sessionUser}
      allTwitts={userPage.twitts}
      userId={userPage.id}
      type="without_replies"
    />
  );
}

export default Page;
