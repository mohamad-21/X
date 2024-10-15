import { Metadata } from "next";
import React from "react";
import { auth } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import TwittsWrapper from "@/app/_ui/TwittsWrapper";
import Header from "@/app/_ui/Header";

export const metadata: Metadata = {
  title: "Home"
}

async function Page() {
  const session = await auth();
  if (!session) redirect('/');
  return (
    <>
      <Header user={session?.user} />
      <TwittsWrapper session={session} />
    </>
  )
}

export default Page;
