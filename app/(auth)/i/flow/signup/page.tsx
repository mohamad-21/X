import React from "react";
import CredentialsFlow from "@/app/(auth)/i/flow/signup/credentials/CredentailsFlow";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("signupForX"),
  };
}

function Page() {
  return <CredentialsFlow />;
}

export default Page;
