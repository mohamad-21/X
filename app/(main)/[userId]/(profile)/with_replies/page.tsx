import { getUserDataById, getUserDetailsById } from "@/app/_lib/actions";
import TwittsList from "@/app/_ui/TwittsList";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata | void> {
  const [user, t] = await Promise.all([
    getUserDetailsById(decodeURIComponent(params.userId)),
    getTranslations(),
  ]);
  if (user) {
    return {
      title: t("postsWithRepliesByUser", { user: user.username }),
    };
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const user = await getUserDataById(decodeURIComponent(params.userId));
  if (!user) notFound();

  return (
    <TwittsList
      user={user}
      allTwitts={user.twitts}
      userId={user.id}
      type="with_replies"
    />
  );
}

export default Page;
