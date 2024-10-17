import { Metadata } from "next";
import React from "react";
import TwittsWrapper from "@/app/_ui/TwittsWrapper";
import Header from "@/app/_ui/Header";
import { User, UserWithFollows } from "@/app/_lib/definitions";
import { auth } from "@/app/_lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home"
}

async function Page() {
  const session = await auth();
  if (!session) redirect('/');

  const resp = await fetch(`${process.env.AUTH_URL}/api/user/details?id=${session?.user.id}`);
  if (!resp.ok) throw new Error(resp.statusText);
  const user: UserWithFollows = await resp.json();

  return (
    <>
      <Header user={user} />
      <TwittsWrapper user={user} />
    </>
  )
}

export default Page;
