import { auth } from "@/app/_lib/auth";
import { UserData } from "@/app/_lib/definitions";
import Header from "@/app/_ui/Header";
import TwittsWrapper from "@/app/_ui/TwittsWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home"
}

async function Page() {
  const session = await auth();

  const resp = await fetch(`${process.env.AUTH_URL}/api/user/details?id=${session!.user.id}`);
  if (!resp.ok) throw new Error(resp.statusText);
  const user: UserData = await resp.json();

  return (
    <>
      <Header user={user} />
      <TwittsWrapper user={user} />
    </>
  )
}

export default Page;
