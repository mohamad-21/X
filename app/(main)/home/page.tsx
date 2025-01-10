export const dynamic = "force-dynamic";

import { auth } from "@/app/_lib/auth";
import { UserData } from "@/app/_lib/definitions";
import Header from "@/app/_ui/Header";
import TwittsWrapper from "@/app/_ui/TwittsWrapper";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("home"),
  };
}

async function Page() {
  const session = await auth();
  const resp = await fetch(
    `${process.env.AUTH_URL}/api/user/info?id=${session!.user.id}`
  );
  if (!resp.ok) throw new Error(resp.statusText);
  const user: UserData = await resp.json();

  return (
    <>
      <Header user={user} />
      <TwittsWrapper user={user} />
    </>
  );
}

export default Page;
