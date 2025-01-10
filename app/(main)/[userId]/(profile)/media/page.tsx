import { getUserDataById, getUserDetailsById } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
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
      title: t("mediaPostsByUser", { user: user.username }),
    };
  }
}

async function Page({ params }: { params: { userId: string } }) {
  const session = await auth();
  const userId = decodeURIComponent(params.userId);
  const user = await getUserDataById(userId, {
    mediaOnly: true,
  });
  const t = await getTranslations();
  if (!user) notFound();

  return (
    <div className="px-1 py-6">
      {user.twitts.length > 0 ? (
        <TwittsList
          mediaOnly
          userId={user.id}
          user={user}
          allTwitts={user.twitts}
        />
      ) : (
        <div className="mx-auto max-w-xs">
          <h1 className="text-3xl font-extrabold mb-1">
            {userId === session?.user.username ? (
              <>{t("youHasNotPostedMediaMessage")}</>
            ) : (
              <>
                {t("notPostedMediaMessage", {
                  who: `@${userId}`,
                })}
              </>
            )}
          </h1>
          <p className="text-default-400">
            {userId === session?.user.username ? (
              <>{t("youHasNotPostedMediaSubMessage")}</>
            ) : (
              <>{t("notPostedMediaSubMessage")}</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default Page;
